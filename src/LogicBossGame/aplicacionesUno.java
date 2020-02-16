package LogicBossGame;

class aplicacionesUno{

    short expTotal, estExpTotal, estExp, exp, nivelBoosApli = 1, nivelPjApli = 1;
    
    void crearExpPersonaje(){
        expTotal = 60;
        exp = 0;
        estExp = exp;
        estExpTotal = expTotal;
    }
    
    void nivelBossAplicaciones(){
        nivelBoosApli += 1;
    }
    
    void nivelPjAplicaciones(){
        nivelPjApli += 1;
    }
    
    short probabilidad(){
        short a = (short)((Math.random() * 5000) + 1);
        return a;
    }
    
    void aumentarExp1(){
        estExp += (short)(15 + (nivelBoosApli * 2) - nivelPjApli);
    }
    
    void aumentarExp2(){
        int x = (int)(Math.random() * 10) + 1;
        if(x == 3 && x == 5 && x == 7 && x == 9){
            estExp += (short)(nivelBoosApli * probabilidad());
        }else{
            if(x == 2 && x == 4 && x == 6 && x == 8){
                estExp += (short)((nivelBoosApli * probabilidad()) / 2);
            }else{
                estExp += (short)((Math.random() * 9) + 1);
            }
        }
    }
    
    void aumentarExpTotal(){
        expTotal += 60;
        estExp = exp;
    }
    
    void aumentarExpJuego(){
        int x = (int)(Math.random() * 2) + 1;
        if(x == 1){
            aumentarExp2();
        }else{
            aumentarExp1();
        }
    }
    
    void estadoAplicaciones(){
        System.out.println("\n EXP Actual: " +estExp+ ", EXP Faltante: " +(expTotal - estExp));
    }
    
    public static void main(String[]args){
    }
}
