package LogicBossGame;
class personajesUno{
    
    int vida, ataque, velocidad, esquiva, estVIDA, estATAQUE, estVELOCIDAD, estESQUIVA, nivelPj = 1;
    
    void nivelPersonaje(){
        nivelPj += 1;
    }
    
    int mostrarNivelPersonaje(){
        return nivelPj;
    }
    
    void crearPaladin(){
        vida = 10;
        ataque = 10;
        velocidad = 10;
        esquiva = 10;
        estVIDA = vida;
        estATAQUE = ataque;
        estVELOCIDAD = velocidad;
        estESQUIVA = esquiva;
    }
        
    void crearAsesino(){
        vida = 8;
        ataque = 10;
        velocidad = 11;
        esquiva = 11;
        estVIDA = vida;
        estATAQUE = ataque;
        estVELOCIDAD = velocidad;
        estESQUIVA = esquiva;
    }
        
    void crearMago(){
        vida = 8;
        ataque = 14;
        velocidad = 6;
        esquiva = 12;
        estVIDA = vida;
        estATAQUE = ataque;
        estVELOCIDAD = velocidad;
        estESQUIVA = esquiva;
    }
        
    void crearArquero(){
        vida = 9;
        ataque = 12;
        velocidad = 10;
        esquiva = 8;
        estVIDA = vida;
        estATAQUE = ataque;
        estVELOCIDAD = velocidad;
        estESQUIVA = esquiva;
    }
    
    void crearMessi(){
        vida = 799;
        ataque = 799;
        velocidad = 799;
        esquiva = 799;
        estVIDA = vida;
        estATAQUE = ataque;
        estVELOCIDAD = velocidad;
        estESQUIVA = esquiva;
    }
    
    void crearSaitama(){
        vida = 899999999;
        ataque = 899999999;
        velocidad = 899999999;
        esquiva = 899999999;
        estVIDA = vida;
        estATAQUE = ataque;
        estVELOCIDAD = velocidad;
        estESQUIVA = esquiva;
    }
    
    int aumentarVida(int a){
        vida += a;
        estVIDA = vida;
        return estVIDA;
        
    }
    
    int aumentarAtaque(int a){
        ataque += a;
        estATAQUE = ataque;
        return estATAQUE;
    }
    
    int aumentarVelocidad(int a){
        velocidad += a;
        estVELOCIDAD = velocidad;
        return estVELOCIDAD;
    }
    
    int aumentarEsquiva(int a){
        esquiva += a;
        estESQUIVA = esquiva;
        return estESQUIVA;
    }
    
    int disminuirVida(int a){
        estVIDA -= a;
        return estVIDA;
        
    }
    
    void estadoPersonaje(){
        System.out.println(" Vida: " +estVIDA);
        System.out.println(" Ataque " +estATAQUE);
        System.out.println(" Velocidad: " +estVELOCIDAD);
        System.out.println(" Esquiva: " +estESQUIVA);
    }
    
    public static void main(String[]args){
    }
}
