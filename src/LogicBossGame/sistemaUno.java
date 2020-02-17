package LogicBossGame;

import java.util.*;

class sistemaUno{
    
    Scanner leer = new Scanner(System.in);
    
    boolean decidirEsquivaAtaque(int a, int b){
        int proba1 = 0, proba2 = 0;
        if(b >= a){
            proba1 = (int)(1 + Math.random() * 10);
            proba2 = 10 - proba1;
        }else{
            proba2 = (int)(1 + Math.random() * 10);
            proba1 = 10 - proba2;
        }
        return proba1 <= proba2;
    }
    
    boolean decidirAtaqueDoble(int a, int b){
        int proba;
        if(a <= b){
            proba = (int)(Math.random() * b);
            return proba >= a;
        }else{
            proba = (int)(Math.random() * a);
            return proba >= b;
        }
    }
    
    String seleccionar(){
        String pjs = "0";
        System.out.print(" ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  LOGIC BOSS GAME ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n\n"
                + "                                                 ¡¡¡ ADIVINANZAS BONUS !!!\n\n"
                + " (#) ¡UN AGRICULTOR TIENE TRES MONTONES DE PAJA EN EL PAJAR Y CUATRO EN EL PRADO. SI LOS JUNTA, ¿CUANTOS MONTONES TIENE?!\n"
                + " (#) ¡¿LA PULGA?!\n\n");
        System.out.print("                                            INSTRUCCIONES E INFORMACION DEL JUEGO\n\n"
                + " (#) Los stats o atributos de los personajes afectan en el desarrollo de la siguiente manera:\n\n"
                + "     (A) La vida es la cantidad de daño que puede aguantar un personaje o el boss.\n"
                + "     (B) El ataque es la cantida de daño que puede producir por cada ataque un personaje o el boss.\n"
                + "     (C) La velocidad es la probabilidad que tiene de atacar dos veces por turno un personaje o el boss; esta es\n"
                + "         calculada por el valor del stat o atributo mas alto entre el personaje y el boss.\n"
                + "     (D) La esquiva es la probabilidad que tiene de evitar los ataques un personaje o el boss; esta es calculada\n"
                + "         por el valor del stat o atributo mas alto entre el personaje y el boss.\n\n"
                + " (#) El nivel del boss mas alto en la actualidad es de nivel 25 para personajes que no son de las adivinanzas bonus.\n"
                + " (#) El nivel del boss mas alto en la actualidad es de nivel 35 para personajes que son de adivinanzas bonus.\n"
                + " (#) Al subir de nivel el personaje, obtendra dos puntos para subir como desee el jugador a los stats o atributos del\n"
                + "     personaje.\n"
                + " (#) Al ser derrotado un boss, el siguiente boss sera de nivel superior (+1); los stats o atributos del boss suben\n"
                + "     cada nivel.\n"
                + " (#) Al contestar de forma correcta las adivinanzas bonus se optiene un personaje secreto; por partida solo se puede\n"
                + "     responder una adivinanza; cada adivinanza proporciona un personaje unico en cuanto a stats o atributos, nombre,\n"
                + "     jugabilidad, escalado de nivel de los boss y cantidad de puntos que se ganan por nivel (X2).\n"
                + " (#) Las respuestas deben darsen escribiendo el valor numerico.\n"
                + " (#) Despues de cada pregunta apareceran 4 posibles respuestas a la misma; una de las posibles respuestas es correcta.\n"
                + " (#) Las operaciones matematicas de division deben ser respondidas unicamente con el valor entero del resultado.\n\n");
        System.out.print("                                                 ¡¡¡ COMIENZO DEL JUEGO !!!\n\n");
        System.out.print(" Seleccione uno de los siguientes personajes (ESCRIBA EL NUMERO DE LA IZQUIERDA CUANDO VAYA A SELECCIONAR):\n\n"
                + " (1) Paladin:\n     Vida: 10, Ataque: 10, Velocidad: 10, Esquiva: 10\n"
                + " (2) Asesino:\n     Vida: 8, Ataque: 10, Velocidad: 11, Esquiva: 11\n"
                + " (3) Mago:\n     Vida: 8, Ataque: 14, Velocidad: 6, Esquiva: 12\n"
                + " (4) Arquero:\n     Vida: 9, Ataque: 12, Velocidad: 10, Esquiva: 8\n"
                + "\n El personaje que desea seleccionar es: "
        );
        pjs = leer.next();
        
        if(pjs.equals("uno")){
            return pjs = "777";
        }else{
            if(pjs.equals("messi")){
                return pjs = "888";
            }else{
                return pjs;
            }
        }
    }
    
    int subirHabilidades(){
        int x = leer.nextInt();
        return x;
    }
    
    public static void main(String[]args){
        boolean n;
        sistemaUno sy = new sistemaUno();
        personajesUno pj = new personajesUno();
        bossUno bs = new bossUno();
        operacionesUno pr = new operacionesUno();
        aplicacionesUno ap = new aplicacionesUno();
        
        switch (sy.seleccionar()) {
            case "1":
                System.out.println("\n ¡¡¡ FELICIDADES AHORA ERES UN PALADIN !!!");
                pj.crearPaladin();
                bs.crearBoss();
                ap.crearExpPersonaje();
                while(pj.estVIDA > 0){
                    System.out.println("\n STATS BOSS");
                    System.out.println(" Level: " +bs.mostarNivelBoss());
                    bs.estadoBoss();
                    System.out.println("\n STATS PERSONAJE");
                    System.out.println(" Level: " +pj.mostrarNivelPersonaje());
                    pj.estadoPersonaje();
                    ap.estadoAplicaciones();
                    n = pr.preguntas();
                    if(n != false){
                        if(sy.decidirEsquivaAtaque(bs.esquivaBoss, pj.esquiva) != true){
                            bs.disminuirVidaBoss(pj.ataque);
                            ap.aumentarExpJuego();
                            System.out.println("\n HAS LOGRADO DARLE AL BOSS(x1)!!!");
                            if(sy.decidirAtaqueDoble(bs.velocidadBoss, pj.velocidad) != false){
                                bs.disminuirVidaBoss(pj.ataque);
                                ap.aumentarExpJuego();
                                System.out.println("\n HAS LOGRADO DARLE AL BOSS UN SEGUNDO ATAQUE(x2)!!!");
                            }
                        }else{
                            System.out.println("\n HAS FALLADO, EL BOSS TE A ESQUIVADO!!!");
                        }
                    }else{
                        if(sy.decidirEsquivaAtaque(bs.esquivaBoss, pj.esquiva) != false){
                            pj.disminuirVida(bs.ataqueBoss);
                            System.out.println("\n HAS FALLADO, NO LOGRASTE ESQUIVAR AL BOSS(x1)!!!");
                            if(sy.decidirAtaqueDoble(bs.velocidadBoss, pj.velocidad) != true){
                                pj.disminuirVida(bs.ataqueBoss);
                                System.out.println("\n HAS FALLADO, NO LOGRASTE ESQUIVAR AL BOSS DE NUEVO(x2)!!!");
                            }
                        }else{
                            System.out.println("\n HAS LOGRADO ESQUIVAR EL ATAQUE DEL BOSS!!!");
                        }
                    }
                    if(bs.esTvidaBoss <= 0){
                        System.out.println("\n FELICIDADES, HAS VENCIDO AL BOSS DE NIVEL " +bs.mostarNivelBoss()+ "!!!");
                        bs.nivelBoss();
                        bs.mostarNivelBoss();
                        bs.aumertarVidaBoss();
                        bs.aumentarAtaqueBoss();
                        bs.aumentarEsquivaBoss();
                        bs.nivelPersonajeBoss();
                        bs.aumentarVelocidadBoss();
                    }
                    if(bs.nivelBoss == 25){
                        System.out.println("\n ¡¡¡ FELICIDADES, HAS VENCIDO A TODOS LOS BOSS DEL JUEGO !!!");
                        break;
                    }
                    if((ap.expTotal - ap.estExp) <= 0){
                        pj.nivelPersonaje();
                        ap.nivelBossAplicaciones();
                        ap.nivelPjAplicaciones();
                        ap.aumentarExpTotal();
                        System.out.print("\n Has ganado 2 puntos para mejorar tus stats:\n");
                        for(int i = 0; i < 2; i++){
                            pj.mostrarNivelPersonaje();
                            System.out.print("\n (1) Aumentar Vida"
                                    + " (2) Aumentar Ataque"
                                    + " (3) Aumentar Velocidad"
                                    + " (4) Aumentar Esquiva\n"
                                    + " Escriba el numero del stat a mejorar: ");
                            int x = sy.subirHabilidades();
                            if(x == 1){
                                pj.aumentarVida(1);
                            }else{
                                if(x == 2){
                                    pj.aumentarAtaque(1);
                                }else{
                                    if(x == 3){
                                        pj.aumentarVelocidad(1);
                                    }else{
                                        pj.aumentarEsquiva(1);
                                    }
                                }
                            }
                        }
                    }  
                }
                if(pj.estVIDA <= 0){
                    System.out.println("\n HAS PERDIDO, EL BOSS DE NIVEL " +bs.mostarNivelBoss()+ " TE A DERROTADO!!!");
                }
                break;
            case "2":
                System.out.println("\n ¡¡¡ FELICIDADES AHORA ERES UN ASESINO !!!");
                pj.crearAsesino();
                bs.crearBoss();
                ap.crearExpPersonaje();
                while(pj.estVIDA > 0){
                    System.out.println("\n STATS BOSS");
                    System.out.println(" Level: " +bs.mostarNivelBoss());
                    bs.estadoBoss();
                    System.out.println("\n STATS PERSONAJE");
                    System.out.println(" Level: " +pj.mostrarNivelPersonaje());
                    pj.estadoPersonaje();
                    ap.estadoAplicaciones();
                    n = pr.preguntas();
                    if(n != false){
                        if(sy.decidirEsquivaAtaque(bs.esquivaBoss, pj.esquiva) != true){
                            bs.disminuirVidaBoss(pj.ataque);
                            ap.aumentarExpJuego();
                            System.out.println("\n HAS LOGRADO DARLE AL BOSS(x1)!!!");
                            if(sy.decidirAtaqueDoble(bs.velocidadBoss, pj.velocidad) != false){
                                bs.disminuirVidaBoss(pj.ataque);
                                ap.aumentarExpJuego();
                                System.out.println("\n HAS LOGRADO DARLE AL BOSS UN SEGUNDO ATAQUE(x2)!!!");
                            }
                        }else{
                            System.out.println("\n HAS FALLADO, EL BOSS TE A ESQUIVADO!!!");
                        }
                    }else{
                        if(sy.decidirEsquivaAtaque(bs.esquivaBoss, pj.esquiva) != false){
                            pj.disminuirVida(bs.ataqueBoss);
                            System.out.println("\n HAS FALLADO, NO LOGRASTE ESQUIVAR AL BOSS(x1)!!!");
                            if(sy.decidirAtaqueDoble(bs.velocidadBoss, pj.velocidad) != true){
                                pj.disminuirVida(bs.ataqueBoss);
                                System.out.println("\n HAS FALLADO, NO LOGRASTE ESQUIVAR AL BOSS DE NUEVO(x2)!!!");
                            }
                        }else{
                            System.out.println("\n HAS LOGRADO ESQUIVAR EL ATAQUE DEL BOSS!!!");
                        }
                    }
                    if(bs.esTvidaBoss <= 0){
                        System.out.println("\n FELICIDADES, HAS VENCIDO AL BOSS DE NIVEL " +bs.mostarNivelBoss()+ "!!!");
                        bs.nivelBoss();
                        bs.mostarNivelBoss();
                        bs.aumertarVidaBoss();
                        bs.aumentarAtaqueBoss();
                        bs.aumentarEsquivaBoss();
                        bs.nivelPersonajeBoss();
                        bs.aumentarVelocidadBoss();
                    }
                    if(bs.nivelBoss == 25){
                        System.out.println("\n ¡¡¡ FELICIDADES, HAS VENCIDO A TODOS LOS BOSS DEL JUEGO !!!");
                        break;
                    }
                    if((ap.expTotal - ap.estExp) <= 0){
                        pj.nivelPersonaje();
                        ap.nivelBossAplicaciones();
                        ap.nivelPjAplicaciones();
                        ap.aumentarExpTotal();
                        System.out.print("\n Has ganado 2 puntos para mejorar tus stats:\n");
                        for(int i = 0; i < 2; i++){
                            pj.mostrarNivelPersonaje();
                            System.out.print("\n (1) Aumentar Vida"
                                    + " (2) Aumentar Ataque"
                                    + " (3) Aumentar Velocidad"
                                    + " (4) Aumentar Esquiva\n"
                                    + " Escriba el numero del stat a mejorar: ");
                            int x = sy.subirHabilidades();
                            if(x == 1){
                                pj.aumentarVida(1);
                            }else{
                                if(x == 2){
                                    pj.aumentarAtaque(1);
                                }else{
                                    if(x == 3){
                                        pj.aumentarVelocidad(1);
                                    }else{
                                        pj.aumentarEsquiva(1);
                                    }
                                }
                            }
                        }
                    }  
                }
                if(pj.estVIDA <= 0){
                    System.out.println("\n HAS PERDIDO, EL BOSS DE NIVEL " +bs.mostarNivelBoss()+ " TE A DERROTADO!!!");
                }
                break;
            case "3":
                System.out.println("\n ¡¡¡ FELICIDADES AHORA ERES UN MAGO !!!");
                pj.crearMago();
                bs.crearBoss();
                ap.crearExpPersonaje();
                while(pj.estVIDA > 0){
                    System.out.println("\n STATS BOSS");
                    System.out.println(" Level: " +bs.mostarNivelBoss());
                    bs.estadoBoss();
                    System.out.println("\n STATS PERSONAJE");
                    System.out.println(" Level: " +pj.mostrarNivelPersonaje());
                    pj.estadoPersonaje();
                    ap.estadoAplicaciones();
                    n = pr.preguntas();
                    if(n != false){
                        if(sy.decidirEsquivaAtaque(bs.esquivaBoss, pj.esquiva) != true){
                            bs.disminuirVidaBoss(pj.ataque);
                            ap.aumentarExpJuego();
                            System.out.println("\n HAS LOGRADO DARLE AL BOSS(x1)!!!");
                            if(sy.decidirAtaqueDoble(bs.velocidadBoss, pj.velocidad) != false){
                                bs.disminuirVidaBoss(pj.ataque);
                                ap.aumentarExpJuego();
                                System.out.println("\n HAS LOGRADO DARLE AL BOSS UN SEGUNDO ATAQUE(x2)!!!");
                            }
                        }else{
                            System.out.println("\n HAS FALLADO, EL BOSS TE A ESQUIVADO!!!");
                        }
                    }else{
                        if(sy.decidirEsquivaAtaque(bs.esquivaBoss, pj.esquiva) != false){
                            pj.disminuirVida(bs.ataqueBoss);
                            System.out.println("\n HAS FALLADO, NO LOGRASTE ESQUIVAR AL BOSS(x1)!!!");
                            if(sy.decidirAtaqueDoble(bs.velocidadBoss, pj.velocidad) != true){
                                pj.disminuirVida(bs.ataqueBoss);
                                System.out.println("\n HAS FALLADO, NO LOGRASTE ESQUIVAR AL BOSS DE NUEVO(x2)!!!");
                            }
                        }else{
                            System.out.println("\n HAS LOGRADO ESQUIVAR EL ATAQUE DEL BOSS!!!");
                        }
                    }
                    if(bs.esTvidaBoss <= 0){
                        System.out.println("\n FELICIDADES, HAS VENCIDO AL BOSS DE NIVEL " +bs.mostarNivelBoss()+ "!!!");
                        bs.nivelBoss();
                        bs.mostarNivelBoss();
                        bs.aumertarVidaBoss();
                        bs.aumentarAtaqueBoss();
                        bs.aumentarEsquivaBoss();
                        bs.nivelPersonajeBoss();
                        bs.aumentarVelocidadBoss();
                    }
                    if(bs.nivelBoss == 25){
                        System.out.println("\n ¡¡¡ FELICIDADES, HAS VENCIDO A TODOS LOS BOSS DEL JUEGO !!!");
                        break;
                    }
                    if((ap.expTotal - ap.estExp) <= 0){
                        pj.nivelPersonaje();
                        ap.nivelBossAplicaciones();
                        ap.nivelPjAplicaciones();
                        ap.aumentarExpTotal();
                        System.out.print("\n Has ganado 2 puntos para mejorar tus stats:\n");
                        for(int i = 0; i < 2; i++){
                            pj.mostrarNivelPersonaje();
                            System.out.print("\n (1) Aumentar Vida"
                                    + " (2) Aumentar Ataque"
                                    + " (3) Aumentar Velocidad"
                                    + " (4) Aumentar Esquiva\n"
                                    + " Escriba el numero del stat a mejorar: ");
                            int x = sy.subirHabilidades();
                            if(x == 1){
                                pj.aumentarVida(1);
                            }else{
                                if(x == 2){
                                    pj.aumentarAtaque(1);
                                }else{
                                    if(x == 3){
                                        pj.aumentarVelocidad(1);
                                    }else{
                                        pj.aumentarEsquiva(1);
                                    }
                                }
                            }
                        }
                    }  
                }
                if(pj.estVIDA <= 0){
                    System.out.println("\n HAS PERDIDO, EL BOSS DE NIVEL " +bs.mostarNivelBoss()+ " TE A DERROTADO!!!");
                }
                break;
            case "4":
                System.out.println("\n ¡¡¡ FELICIDADES AHORA ERES UN ARQUERO !!!");
                pj.crearArquero();
                bs.crearBoss();
                ap.crearExpPersonaje();
                while(pj.estVIDA > 0){
                    System.out.println("\n STATS BOSS");
                    System.out.println(" Level: " +bs.mostarNivelBoss());
                    bs.estadoBoss();
                    System.out.println("\n STATS PERSONAJE");
                    System.out.println(" Level: " +pj.mostrarNivelPersonaje());
                    pj.estadoPersonaje();
                    ap.estadoAplicaciones();
                    n = pr.preguntas();
                    if(n != false){
                        if(sy.decidirEsquivaAtaque(bs.esquivaBoss, pj.esquiva) != true){
                            bs.disminuirVidaBoss(pj.ataque);
                            ap.aumentarExpJuego();
                            System.out.println("\n HAS LOGRADO DARLE AL BOSS(x1)!!!");
                            if(sy.decidirAtaqueDoble(bs.velocidadBoss, pj.velocidad) != false){
                                bs.disminuirVidaBoss(pj.ataque);
                                ap.aumentarExpJuego();
                                System.out.println("\n HAS LOGRADO DARLE AL BOSS UN SEGUNDO ATAQUE(x2)!!!");
                            }
                        }else{
                            System.out.println("\n HAS FALLADO, EL BOSS TE A ESQUIVADO!!!");
                        }
                    }else{
                        if(sy.decidirEsquivaAtaque(bs.esquivaBoss, pj.esquiva) != false){
                            pj.disminuirVida(bs.ataqueBoss);
                            System.out.println("\n HAS FALLADO, NO LOGRASTE ESQUIVAR AL BOSS(x1)!!!");
                            if(sy.decidirAtaqueDoble(bs.velocidadBoss, pj.velocidad) != true){
                                pj.disminuirVida(bs.ataqueBoss);
                                System.out.println("\n HAS FALLADO, NO LOGRASTE ESQUIVAR AL BOSS DE NUEVO(x2)!!!");
                            }
                        }else{
                            System.out.println("\n HAS LOGRADO ESQUIVAR EL ATAQUE DEL BOSS!!!");
                        }
                    }
                    if(bs.esTvidaBoss <= 0){
                        System.out.println("\n FELICIDADES, HAS VENCIDO AL BOSS DE NIVEL " +bs.mostarNivelBoss()+ "!!!");
                        bs.nivelBoss();
                        bs.mostarNivelBoss();
                        bs.aumertarVidaBoss();
                        bs.aumentarAtaqueBoss();
                        bs.aumentarEsquivaBoss();
                        bs.nivelPersonajeBoss();
                        bs.aumentarVelocidadBoss();
                    }
                    if(bs.nivelBoss == 25){
                        System.out.println("\n ¡¡¡ FELICIDADES, HAS VENCIDO A TODOS LOS BOSS DEL JUEGO !!!");
                        break;
                    }
                    if((ap.expTotal - ap.estExp) <= 0){
                        pj.nivelPersonaje();
                        ap.nivelBossAplicaciones();
                        ap.nivelPjAplicaciones();
                        ap.aumentarExpTotal();
                        System.out.print("\n Has ganado 2 puntos para mejorar tus stats:\n");
                        for(int i = 0; i < 2; i++){
                            pj.mostrarNivelPersonaje();
                            System.out.print("\n (1) Aumentar Vida"
                                    + " (2) Aumentar Ataque"
                                    + " (3) Aumentar Velocidad"
                                    + " (4) Aumentar Esquiva\n"
                                    + " Escriba el numero del stat a mejorar: ");
                            int x = sy.subirHabilidades();
                            if(x == 1){
                                pj.aumentarVida(1);
                            }else{
                                if(x == 2){
                                    pj.aumentarAtaque(1);
                                }else{
                                    if(x == 3){
                                        pj.aumentarVelocidad(1);
                                    }else{
                                        pj.aumentarEsquiva(1);
                                    }
                                }
                            }
                        }
                    }  
                }
                if(pj.estVIDA <= 0){
                    System.out.println("\n HAS PERDIDO, EL BOSS DE NIVEL " +bs.mostarNivelBoss()+ " TE A DERROTADO!!!");
                }
                break;
            case "777":
                System.out.println("\n ¡¡¡ FELICIDADES AHORA ERES SAITAMA !!!");
                pj.crearSaitama();
                bs.crearBoss();
                ap.crearExpPersonaje();
                while(pj.estVIDA > 0){
                    System.out.println("\n STATS BOSS");
                    System.out.println(" Level: " +bs.mostarNivelBoss());
                    bs.estadoBoss();
                    System.out.println("\n STATS PERSONAJE");
                    System.out.println(" Level: " +pj.mostrarNivelPersonaje());
                    pj.estadoPersonaje();
                    ap.estadoAplicaciones();
                    n = pr.preguntas();
                    if(n != false){
                        if(sy.decidirEsquivaAtaque(bs.esquivaBoss, pj.esquiva) != true){
                            bs.disminuirVidaBoss(pj.ataque);
                            ap.aumentarExpJuego();
                            ap.aumentarExpJuego();
                            System.out.println("\n HAS LOGRADO DARLE AL BOSS(x1)!!!");
                            if(sy.decidirAtaqueDoble(bs.velocidadBoss, pj.velocidad) != false){
                                bs.disminuirVidaBoss(pj.ataque);
                                ap.aumentarExpJuego();
                                ap.aumentarExpJuego();
                                System.out.println("\n HAS LOGRADO DARLE AL BOSS UN SEGUNDO ATAQUE(x2)!!!");
                            }
                        }else{
                            System.out.println("\n HAS FALLADO, EL BOSS TE A ESQUIVADO!!!");
                        }
                    }else{
                        if(sy.decidirEsquivaAtaque(bs.esquivaBoss, pj.esquiva) != false){
                            pj.disminuirVida(bs.ataqueBoss);
                            System.out.println("\n HAS FALLADO, NO LOGRASTE ESQUIVAR AL BOSS(x1)!!!");
                            if(sy.decidirAtaqueDoble(bs.velocidadBoss, pj.velocidad) != true){
                                pj.disminuirVida(bs.ataqueBoss);
                                System.out.println("\n HAS FALLADO, NO LOGRASTE ESQUIVAR AL BOSS DE NUEVO(x2)!!!");
                            }
                        }else{
                            System.out.println("\n HAS LOGRADO ESQUIVAR EL ATAQUE DEL BOSS!!!");
                            System.out.println("\n EL BOSS DE NIVEL " +bs.mostarNivelBoss()+ " A EVOLUCIONADO!!!");
                            bs.nivelBoss();
                            bs.mostarNivelBoss();
                            bs.nivelPersonajeBoss();
                            bs.aumentarVelocidadBoss();
                            for(int j = 0; j < 35000; j++){
                                bs.aumertarVidaBoss();
                            }
                            for(int i = 0; i < 3500000; i++){
                                bs.aumentarAtaqueBoss();
                                bs.aumentarEsquivaBoss();
                            }
                        }
                    }
                    if(bs.esTvidaBoss <= 0){
                        System.out.println("\n FELICIDADES, HAS VENCIDO AL BOSS DE NIVEL " +bs.mostarNivelBoss()+ "!!!");
                        bs.nivelBoss();
                        bs.mostarNivelBoss();
                        bs.nivelPersonajeBoss();
                        bs.aumentarVelocidadBoss();
                        for(int j = 0; j < 75000; j++){
                                bs.aumertarVidaBoss();
                            }
                        for(int i = 0; i < 7000000; i++){
                            bs.aumentarAtaqueBoss();
                            bs.aumentarEsquivaBoss();
                        }
                    }
                    if(bs.nivelBoss == 35 && bs.esTvidaBoss <= 0 && pj.nivelPj > 4){
                        System.out.println("\n ¡¡¡ FELICIDADES, HAS VENCIDO A TODOS LOS BOSS DEL JUEGO !!!");
                        break;
                    }else{
                        if(bs.nivelBoss == 35 && bs.esTvidaBoss > 0 && pj.nivelPj <= 4){
                            System.out.println("\n ¡¡¡ EL NIVEL DEL BOSS ES EL MAXIMO, HAS FRACASADO!!!");
                            break;
                        }
                    }
                    if((ap.expTotal - ap.estExp) <= 0){
                        pj.nivelPersonaje();
                        ap.nivelBossAplicaciones();
                        ap.nivelPjAplicaciones();
                        ap.aumentarExpTotal();
                        System.out.print("\n Has ganado 4 puntos para mejorar tus stats:\n");
                        for(int i = 0; i < 4; i++){
                            pj.mostrarNivelPersonaje();
                            System.out.print("\n (1) Aumentar Vida"
                                    + " (2) Aumentar Ataque"
                                    + " (3) Aumentar Velocidad"
                                    + " (4) Aumentar Esquiva\n"
                                    + " Escriba el numero del stat a mejorar: ");
                            int x = sy.subirHabilidades();
                            if(x == 1){
                                pj.aumentarVida(1);
                            }else{
                                if(x == 2){
                                    pj.aumentarAtaque(1);
                                }else{
                                    if(x == 3){
                                        pj.aumentarVelocidad(1);
                                    }else{
                                        pj.aumentarEsquiva(1);
                                    }
                                }
                            }
                        }
                    }  
                }
                if(pj.estVIDA <= 0){
                    System.out.println("\n HAS PERDIDO, EL BOSS DE NIVEL " +bs.mostarNivelBoss()+ " TE A DERROTADO!!!");
                }
                break;
            case "888":
                System.out.println("\n ¡¡¡ FELICIDADES AHORA ERES MESSI !!!");
                pj.crearMessi();
                bs.crearBoss();
                ap.crearExpPersonaje();
                while(pj.estVIDA > 0){
                    System.out.println("\n STATS BOSS");
                    System.out.println(" Level: " +bs.mostarNivelBoss());
                    bs.estadoBoss();
                    System.out.println("\n STATS PERSONAJE");
                    System.out.println(" Level: " +pj.mostrarNivelPersonaje());
                    pj.estadoPersonaje();
                    ap.estadoAplicaciones();
                    n = pr.preguntas();
                    if(n != false){
                        if(sy.decidirEsquivaAtaque(bs.esquivaBoss, pj.esquiva) != true){
                            bs.disminuirVidaBoss(pj.ataque);
                            ap.aumentarExpJuego();
                            ap.aumentarExpJuego();
                            System.out.println("\n HAS LOGRADO DARLE AL BOSS(x1)!!!");
                            if(sy.decidirAtaqueDoble(bs.velocidadBoss, pj.velocidad) != false){
                                bs.disminuirVidaBoss(pj.ataque);
                                ap.aumentarExpJuego();
                                ap.aumentarExpJuego();
                                System.out.println("\n HAS LOGRADO DARLE AL BOSS UN SEGUNDO ATAQUE(x2)!!!");
                            }
                        }else{
                            System.out.println("\n HAS FALLADO, EL BOSS TE A ESQUIVADO!!!");
                        }
                    }else{
                        if(sy.decidirEsquivaAtaque(bs.esquivaBoss, pj.esquiva) != false){
                            pj.disminuirVida(bs.ataqueBoss);
                            System.out.println("\n HAS FALLADO, NO LOGRASTE ESQUIVAR AL BOSS(x1)!!!");
                            if(sy.decidirAtaqueDoble(bs.velocidadBoss, pj.velocidad) != true){
                                pj.disminuirVida(bs.ataqueBoss);
                                System.out.println("\n HAS FALLADO, NO LOGRASTE ESQUIVAR AL BOSS DE NUEVO(x2)!!!");
                            }
                        }else{
                            System.out.println("\n HAS LOGRADO ESQUIVAR EL ATAQUE DEL BOSS!!!");
                            System.out.println("\n EL BOSS DE NIVEL " +bs.mostarNivelBoss()+ " A EVOLUCIONADO!!!");
                            bs.nivelBoss();
                            bs.mostarNivelBoss();
                            bs.nivelPersonajeBoss();
                            bs.aumentarVelocidadBoss();
                            for(int i = 0; i < 15; i++){
                                bs.aumertarVidaBoss();
                                bs.aumentarAtaqueBoss();
                                bs.aumentarEsquivaBoss();
                            }
                        }
                    }
                    if(bs.esTvidaBoss <= 0){
                        System.out.println("\n FELICIDADES, HAS VENCIDO AL BOSS DE NIVEL " +bs.mostarNivelBoss()+ "!!!");
                        bs.nivelBoss();
                        bs.mostarNivelBoss();
                        bs.nivelPersonajeBoss();
                        bs.aumentarVelocidadBoss();
                        for(int i = 0; i < 30; i++){
                            bs.aumertarVidaBoss();
                            bs.aumentarAtaqueBoss();
                            bs.aumentarEsquivaBoss();
                        }
                    }
                    if(bs.nivelBoss == 35 && bs.esTvidaBoss <= 0 && pj.nivelPj > 4){
                        System.out.println("\n ¡¡¡ FELICIDADES, HAS VENCIDO A TODOS LOS BOSS DEL JUEGO !!!");
                        break;
                    }else{
                        if(bs.nivelBoss == 35 && bs.esTvidaBoss > 0 && pj.nivelPj <= 4){
                            System.out.println("\n ¡¡¡ EL NIVEL DEL BOSS ES EL MAXIMO, HAS FRACASADO!!!");
                            break;
                        }
                    }
                    if((ap.expTotal - ap.estExp) <= 0){
                        pj.nivelPersonaje();
                        ap.nivelBossAplicaciones();
                        ap.nivelPjAplicaciones();
                        ap.aumentarExpTotal();
                        System.out.print("\n Has ganado 4 puntos para mejorar tus stats:\n");
                        for(int i = 0; i < 4; i++){
                            pj.mostrarNivelPersonaje();
                            System.out.print("\n (1) Aumentar Vida"
                                    + " (2) Aumentar Ataque"
                                    + " (3) Aumentar Velocidad"
                                    + " (4) Aumentar Esquiva\n"
                                    + " Escriba el numero del stat a mejorar: ");
                            int x = sy.subirHabilidades();
                            if(x == 1){
                                pj.aumentarVida(1);
                            }else{
                                if(x == 2){
                                    pj.aumentarAtaque(1);
                                }else{
                                    if(x == 3){
                                        pj.aumentarVelocidad(1);
                                    }else{
                                        pj.aumentarEsquiva(1);
                                    }
                                }
                            }
                        }
                    }  
                }
                if(pj.estVIDA <= 0){
                    System.out.println("\n HAS PERDIDO, EL BOSS DE NIVEL " +bs.mostarNivelBoss()+ " TE A DERROTADO!!!");
                }
                break;
            default:
                break;
        }
    }
}
