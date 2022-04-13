let listNav = document.querySelectorAll('.nav li');
    function active(){
      listNav.forEach((itemlist)=>
      itemlist.classList.remove('hovered'));
      this.classList.add('hovered');
    }
    listNav.forEach((itemlist) =>
    itemlist.addEventListener('mouseover',active))