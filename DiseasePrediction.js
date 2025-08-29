module.exports=defaultdiseasePrediction=(diseases)=>{
  let remaining = 100;
  const result = [];

  diseases.forEach((disease, index) => {
    if (index === diseases.length - 1) {
      result.push({ disease, probability: remaining });
    } else {
      const prob = Math.floor(Math.random() * (remaining - (diseases.length - index - 1))) + 1;
      result.push({ disease, probability: prob });
      remaining -= prob;
    }
  });

  return result;
}
