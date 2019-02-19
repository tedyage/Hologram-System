var gameloop = function(){
    requestAnimationFrame(this.gameloop);
    hologram_vm.render();
    hologram_vm.update();
};

gameloop();