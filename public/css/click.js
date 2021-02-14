function edit(id){
    let id1=id+'#';
    let id2=id+'$';
    let ele1=document.getElementById(id1);
    let ele2=document.getElementById(id2);
    ele1.classList.add("displayn");
    console.log(ele2.classList);
    ele2.classList.remove("displayn");
}