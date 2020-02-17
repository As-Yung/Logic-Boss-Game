package LogicBossGame;

import java.util.*;

class operacionesUno{
    
    short sum, rest, multi, IND = Short.MAX_VALUE;
    double divi, pregunta = 0;
    Scanner leer = new Scanner(System.in);
    
    short sumar(short a, short b){
        sum = (short)(a + b);
        return sum;
    }
    
    short restar(short a, short b){
        rest = (short)(a - b);
        return rest;
    }
    
    short multiplicar(short a, short b){
        multi = (short)(a * b);
        return multi;
    }
    
    double dividir(short a, short b){
        divi = (short)(a / b);
        return divi;
    }
    
    double potenciar(short a, short b){
        short poten = a;
        if(b == 0){
            if(a == 0){
                poten = IND;
            }else{
                poten = 1;
            }    
        }else{
            for(int i = 0; i < (b - 1); i++){
                poten = (short)(poten * a);
            }
        }
        return poten;
    }
    
    short randomUno(){
        short valor1 = (short)(int)(2 + Math.random() * 45);
        return valor1;
    }
    
    short randomDos(){
        short valor2 = (short)(int)(3 + Math.random() * 15);
        return valor2;
    }
    
    short randomResp(){
        short valorN = (short)(int)(1 + Math.random() * 4);
        return valorN;
    }
    
    int randomFinal(){
        int valorF = (int)(1 + Math.random() * 4);
        return valorF;
    }
    
    void randomPreguntas(double pregunta){
        short[] resp = {(short)(pregunta + randomResp() + 1), (short) pregunta, (short)(pregunta + randomResp() + randomResp()), (short)(pregunta + randomResp() - randomResp() + 2)};
        boolean valor = true;
        int num, cont = 0;
        
        if(resp[1] == 0){
            resp[1] = Short.MAX_VALUE;
        }
        
        while(valor != false){
            num = randomFinal();
            if(resp[num - 1] != 0){
                if(resp[num - 1] == Short.MAX_VALUE){
                    System.out.println(" # "+ 0);
                    resp[num - 1] = 0;
                }else{
                    System.out.println(" # "+ resp[num - 1]);
                    resp[num - 1] = 0;
                }
            }
            
            for(int i = 0; i < 4; i++){
                if(resp[i] == 0){
                    cont += 1;
                }
                
                if(cont == 420){
                    valor = false;
                }
            }
        }
    }
    
    boolean preguntaSuma(){
        short uno = 0, dos = 0;
        uno = randomUno();
        dos = randomDos();
        System.out.println("¿" +uno+ " + " +dos+ "?\n");
        pregunta = sumar(uno, dos);
        randomPreguntas(pregunta);
        System.out.print("\n RTA: ");
        short x = leer.nextShort();
        return x == pregunta;
    }
    
    boolean preguntaResta(){
        short uno = 0, dos = 0;
        uno = randomUno();
        dos = randomDos();
        System.out.println("¿" +uno+ " - " +dos+ "?\n");
        pregunta = restar(uno, dos);
        randomPreguntas(pregunta);  
        System.out.print("\n RTA: ");
        short x = leer.nextShort();
        return x == pregunta;
    }
    
    boolean preguntaMultiplica(){
        short uno = 0, dos = 0;
        uno = (short)((randomResp() * 2) - (randomResp() / 2));
        dos = randomResp();
        System.out.println("¿" +uno+ " * " +dos+ "?\n");
        pregunta = multiplicar(uno, dos);
        randomPreguntas(pregunta);
        System.out.print("\n RTA: ");
        short x = leer.nextShort();
        return x == pregunta;
    }
    
    boolean preguntaDivide(){
        short uno = 0, dos = 0;
        uno = randomUno();
        dos = randomDos();
        System.out.println("¿" +uno+ " // " +dos+ "?\n");
        pregunta = dividir(uno, dos);
        randomPreguntas(pregunta);   
        System.out.print("\n RTA: ");
        short x = leer.nextShort();
        return x == pregunta;
    }
    
    boolean preguntaPotencia(){
        short uno = 0, dos = 0;
        uno = (short)((randomResp() * 2) - (randomResp() / 2));
        dos = randomResp();
        System.out.println("¿" +uno+ " ^ " +dos+ "?\n");
        pregunta = potenciar(uno, dos);
        randomPreguntas(pregunta);
        System.out.print("\n RTA: ");
        short x = leer.nextShort();
        return x == pregunta;
    }
    
    boolean preguntas(){
        boolean n;
        operacionesUno op = new operacionesUno();
        int pregun = (int)(Math.random() * 5) + 1;
        switch (pregun){
            case 1:
                System.out.print("\n Pregunta: ");
                n = op.preguntaSuma();
                return n;
            case 2:
                System.out.print("\n Pregunta: ");
                n = op.preguntaResta();
                return n;
            case 3:
                System.out.print("\n Pregunta: ");
                n = op.preguntaMultiplica();
                return n;
            case 4:
                System.out.print("\n Pregunta: ");
                n = op.preguntaDivide();
                return n;
            case 5:
                System.out.print("\n Pregunta: ");
                n = op.preguntaPotencia();
                return n;
            default:
                break;
        }
        return false;
    }
    
    public static void main(String[]args){
    }
}
