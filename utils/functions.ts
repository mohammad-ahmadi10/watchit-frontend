export const regularTime = (time:number )=>{
    const minute = parseInt((time / 60).toString() , 10).toLocaleString('en-US' , {minimumIntegerDigits:2 , useGrouping:false})
    const second = parseInt((time % 60).toString() , 10).toLocaleString('en-US' , {minimumIntegerDigits:2 , useGrouping:false})
    return [minute , second]
  }


export const forceReload = (router:any) =>{
  router.reload();
}

export const modifyAmountOfView = (view:number)=>{
  let modifiedViews = ""
  if(view === 1){
    modifiedViews = `${view} view . `
  }
  else if(view <= 0)
    modifiedViews = ""
  else 
  modifiedViews = `${view} views . `
  return modifiedViews
}

export const modifyUplodedDate = (d:Date) =>{
  let now = new Date()
  const year = now.getFullYear() - d.getFullYear();
  const month = now.getMonth() - d.getMonth();
  const day = now.getDate() - d.getDate();
  if(year > 0)
     return `since ${year} year${year > 1 ?  "s" : ""} ago`   
  if(year === 0){
    if(month > 0)
     return `since ${month} month${month > 1 ? "s" : ""} ago`
    else if(month === 0){
      if(day > 0)
      return `since ${day} day${day > 1 ? "s" : ""} ago`
      else return `since today`
    }
  }    
}

