export const regularTime = (time:number )=>{
    const minute = parseInt((time / 60).toString() , 10).toLocaleString('en-US' , {minimumIntegerDigits:2 , useGrouping:false})
    const second = parseInt((time % 60).toString() , 10).toLocaleString('en-US' , {minimumIntegerDigits:2 , useGrouping:false})
    return [minute , second]
  }


