package LogicBossGame;
class bossUno{
    
    int vidaBoss, ataqueBoss, velocidadBoss, esquivaBoss, esTvidaBoss, esTataqueBoss, esTvelocidadBoss, esTesquivaBoss, nivelPjs = 1, nivelBoss = 1;
    
    void nivelPersonajeBoss(){
        nivelPjs += 1;
    }
    
    void nivelBoss(){
        nivelBoss += 1;
    }
    
    int mostarNivelBoss(){
        return nivelBoss;
    }
    
    void crearBoss(){
        vidaBoss = 50;
        ataqueBoss = 2;
        velocidadBoss = 8 + ((2 * nivelBoss) - nivelPjs);
        esquivaBoss = 4;
        esTvidaBoss = vidaBoss;
        esTataqueBoss = ataqueBoss;
        esTvelocidadBoss = velocidadBoss;
        esTesquivaBoss = esquivaBoss;
    }
    
    int aumertarVidaBoss(){
        vidaBoss += 15;
        esTvidaBoss = vidaBoss;
        return esTvidaBoss;
    }
    
    int aumentarAtaqueBoss(){
        ataqueBoss += 1;
        esTataqueBoss = ataqueBoss;
        return esTataqueBoss;
    }
    
    int aumentarVelocidadBoss(){
        velocidadBoss = 8 + ((2 * nivelBoss) - nivelPjs);
        esTvelocidadBoss = velocidadBoss;
        return esTvelocidadBoss;
    }
    
    int aumentarEsquivaBoss(){
        esquivaBoss += 3;
        esTesquivaBoss = esquivaBoss;
        return esTesquivaBoss;
    }
    
    int disminuirVidaBoss(int a){
        esTvidaBoss -= a;
        return esTvidaBoss;
    }
    
    void estadoBoss(){
        System.out.println(" Vida: " +esTvidaBoss);
        System.out.println(" Ataque " +esTataqueBoss);
        System.out.println(" Velocidad: " +esTvelocidadBoss);
        System.out.println(" Esquiva: " +esTesquivaBoss);
    }
    
    public static void main(String[]args){
    }
}
