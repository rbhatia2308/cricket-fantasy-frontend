const {onSchedule}=require("firebase-functions/v2/scheduler");
const {initializeApp}=require("firebase-admin/app");
const {getFirestore}=require("firebase-admin/firestore");
const axios=require("axios");

initializeApp();
const db=getFirestore();

exports.updateParticipantScores=onSchedule("every 2 minutes", async ()=>{
  try {
    const apiKey=process.env.CRICAPI_KEY||"your-api-key-here";
    const apiUrl=`https://api.cricapi.com/v1/cricScore?apikey=${apiKey}`;
    const response=await axios.get(apiUrl);
    const liveMatches=response.data.data||[];

    for (const match of liveMatches) {
      const matchId=match.id;
      const groupsSnapshot=await db.collection("groups").get();

      for (const groupDoc of groupsSnapshot.docs) {
        const groupRef=db.collection("groups").doc(groupDoc.id);
        const matchRef=groupRef.collection("matches").doc(matchId);
        const contestsRef=matchRef.collection("contests");
        const contestsSnapshot=await contestsRef.get();

        for (const contestDoc of contestsSnapshot.docs) {
          const participantsRef=contestsRef
              .doc(contestDoc.id)
              .collection("participants");

          const participants=await participantsRef.get();

          for (const participant of participants.docs) {
            const newScore=Math.floor(Math.random()*100);
            await participant.ref.update({score: newScore});
          }
        }
      }
    }

    console.log("Scores updated.");
  } catch (error) {
    console.error("Error updating scores:", error);
  }
});
