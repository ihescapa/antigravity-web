// === MATH DETECTIVE V3 - HARDCODED REALISTIC DATABASE ===
// 20+ casos didácticos puros por mini-juego para una niña de 9 años.

const DB_BUILDER = [
    {
        text: "En la reserva, había <strong>45 pingüinos</strong> en el agua. Luego, <strong>12 pingüinos</strong> se subieron al hielo a dormir. Ordena las pistas para averiguar cuántos quedaron nadando. (Cuidado con los números falsos ⚠️)",
        components: ["45", "-", "12"],
        distractors: ["+", "57", "33", "x"],
        explanation: "Había que hacer una RESTA (-). Si había 45 nadando y 12 se fueron a dormir, es 45 menos 12. ¡El número mayor va siempre primero!"
    },
    {
        text: "Un alienígena compró <strong>20 porciones</strong> de pizza galáctica, pero su perro extraterrestre se comió <strong>8 porciones</strong> a escondidas. ¿Qué cuenta debemos hacer para saber cuántas le quedan?",
        components: ["20", "-", "8"],
        distractors: ["+", "12", "28"],
        explanation: "Si el perro se COMIÓ las porciones, hay que RESTAR (-). 20 menos 8 nos dice lo que quedó."
    },
    {
        text: "El laboratorio secreto fabricó <strong>15 robots</strong> exploradores. Al día siguiente, armaron <strong>5 robots</strong> más. Arma la cuenta para saber el total de robots creados.",
        components: ["15", "+", "5"],
        distractors: ["-", "20", "10", "="],
        explanation: "Si fabricaron más robots, se acumulan. La cuenta era una SUMA (+), 15 más 5. Recuerda que en la suma, el orden de los números no importa."
    },
    {
        text: "La ladrona de guante blanco tenía <strong>30 diamantes</strong> en su bolsa, pero su bolsa tenía un agujero y perdió <strong>14 diamantes</strong> escapando. ¿Cuántos diamantes le quedaron al final?",
        components: ["30", "-", "14"],
        distractors: ["+", "x", "44", "16"],
        explanation: "Si 'perdió' diamantes, la cantidad disminuye. Había que hacer una RESTA: 30 menos 14."
    },
    {
        text: "La bruja del bosque hizo pociones. El lunes preparó <strong>25 botellas</strong> y el martes preparó <strong>10 botellas</strong> extra para la gran fiesta. ¿Qué ecuación nos dice el total?",
        components: ["25", "+", "10"],
        distractors: ["-", "35", "15"],
        explanation: "Para calcular el 'total', unimos dos cantidades. Era una suma: 25 más (+) 10."
    },
    {
        text: "Un camión llevaba <strong>50 cajas</strong> de juguetes al orfanato. En una parada, descargaron <strong>15 cajas</strong>. ¿Cuántas cajas siguieron viaje en el camión?",
        components: ["50", "-", "15"],
        distractors: ["+", "35", "65", "x"],
        explanation: "Si 'descargaron' cajas, esas cajas ya no están en el camión. Es una RESTA (-). 50 menos 15."
    },
    {
        text: "El arqueólogo encontró <strong>18 huesos</strong> de dinosaurio ayer, y hoy desenterró <strong>12 huesos</strong> más pequeños. Arma la cuenta para saber cuántos huesos tiene en su museo.",
        components: ["18", "+", "12"],
        distractors: ["-", "30", "6"],
        explanation: "¡Sumar es juntar! 18 huesos viejos más (+) 12 huesos nuevos."
    },
    {
        text: "El jefe ninja compró <strong>32 espadas</strong> de bambú. Repartió <strong>20 espadas</strong> a sus alumnos nuevos. ¿Qué lógica matemática nos dice cuántas le sobraron en la caja?",
        components: ["32", "-", "20"],
        distractors: ["+", "12", "52", "=", "/"],
        explanation: "Cuando 'repartes' lo que tienes de manera que te lo quitas a ti mismo, es una RESTA. 32 menos (-) las 20 que regaló."
    },
    {
        text: "Un dragón dorado recolectó <strong>100 monedas</strong>. Se gastó <strong>45 monedas</strong> en un nuevo escudo. Ordena la cuenta para ver su dinero actual.",
        components: ["100", "-", "45"],
        distractors: ["+", "55", "145"],
        explanation: "'Gastar' significa quitar dinero de la bolsa. Resta el dinero gastado (45) al dinero total inicial (100)."
    },
    {
        text: "El capitán pirata vio <strong>22 barcos</strong> en el puerto norte, y su vigía vio <strong>11 barcos</strong> en el puerto sur. ¿Cuántos barcos enemigos detectaron en total entre los dos?",
        components: ["22", "+", "11"],
        distractors: ["-", "33", "11", "x"],
        explanation: "Para saber el 'total entre los dos' se combinan las dos cantidades. Es una SUMA."
    }
];

const DB_APPROX = [
    {
        text: "El colegio contrató autobuses para llevar a los <strong>210 niños</strong> de excursión. Saben que en cada autobús caben exactos <strong>50 niños</strong>.<br><br>Pensando rápido en números redondos, ¿alrededor de cuántos autobuses necesitarán?",
        options: ["Cerca de 4 o 5 autobuses", "Cerca de 10 autobuses", "Solo 1 autobús gigante"],
        answerIndex: 0,
        explanation: "Piensa: 50 + 50 = 100. Van dos buses. O sea, 4 buses son 200 niños. Necesitan 4 y un poquito más. ¡La respuesta correcta era 'cerca de 4 o 5'!"
    },
    {
        text: "El granjero espacial cosechó <strong>390 papas alienígenas</strong> y quiere guardarlas en bolsas. En cada bolsa solo entran de a <strong>10 papas</strong>.<br><br>¿Tú qué crees? ¿Aproximadamente cuántas bolsas usará?",
        options: ["Casi 40 bolsas", "Como 4 bolsas", "Más de 100 bolsas"],
        answerIndex: 0,
        explanation: "Si divides 390 entre 10, le quitas un cero al final. Da 39. Así que son casi 40 bolsas."
    },
    {
        text: "Una biblioteca tiene <strong>1.100 libros</strong> sobre magia. Compraron estantes fuertes donde entran justo <strong>100 libros</strong> por cada estante.<br><br>Sin hacer la cuenta escrita, aproxima cuántos estantes necesitan armar.",
        options: ["Unos 11 estantes", "Como 100 estantes", "Solo 2 estantes muy largos"],
        answerIndex: 0,
        explanation: "Cuenta de a cienes: 100, 200... 1000 son diez estantes. Uno más para los 100 que sobran. Son 11 estantes en total."
    },
    {
        text: "El dragón se comió <strong>48 ovejas</strong> el mes pasado. Asumiendo que el dragón come aproximadamente la misma cantidad cada mes, ¿Cuántas ovejas se comerá en los próximos <strong>2 meses</strong> juntos?",
        options: ["Casi 100 ovejas", "Unas 48 ovejas", "Cerca de 200 ovejas"],
        answerIndex: 0,
        explanation: "El doble de 48 es casi el doble de 50. Y el doble de 50 es 100. Por ende, la respuesta rápida es 'casi 100' ovejas."
    },
    {
        text: "Una máquina hace <strong>98 peluches</strong> por hora. Han estado trabajando sin parar durante <strong>5 horas</strong>.<br><br>Solo estimando, ¿cuántos peluches hicieron hoy?",
        options: ["Alrededor de 500 peluches", "Unos 100 peluches", "Cerca de 900 peluches"],
        answerIndex: 0,
        explanation: "Es casi lo mismo que multiplicar 100 peluches x 5 horas. Y 100x5 da 500. El estimado más certero era 500."
    },
    {
        text: "Queremos cruzar un desierto de <strong>310 kilómetros</strong>. Nuestro camello rápido avanza <strong>100 km por cada día</strong> que viaja.<br><br>¿Aproximadamente en cuántos días estaremos del otro lado?",
        options: ["Alrededor de 3 días", "En 1 solo día", "En 30 días"],
        answerIndex: 0,
        explanation: "Si avanza 100 por día, el día 1 hace 100. El día 2 hace 200. El día 3 sobrepasa los 300. Demorará unos 3 días (y un descansito extra)."
    },
    {
        text: "Un tarro de helado gigante cuesta <strong>$490 pesos</strong>. Tú tienes billetes de <strong>$100</strong>.<br><br>¿Alrededor de cuántos billetes enteros le darás a la cajera sabiendo que pedirás vuelto?",
        options: ["Daré 5 billetes (sobrará vuelto)", "Daré 4 billetes (faltará dinero)", "Daré 10 billetes al azar"],
        answerIndex: 0,
        explanation: "490 está súper cerca de 500. Entregando 5 billetes de 100 llegas a los 500 y aseguras cubrir el pago con un pequeño vuelto para ti."
    },
    {
        text: "Un submarino descendió <strong>950 metros</strong> bajo el mar. Los ingenieros dicen que en cada 'nivel' de presión bajan <strong>100 metros</strong>.<br><br>¿Cuántos niveles cruzó aproximadamente el submarino?",
        options: ["Casi 10 niveles", "Apenas 1 nivel", "Más de 90 niveles"],
        answerIndex: 0,
        explanation: "950 está muy cerca de 1000. Y mil son diez veces 100. Por eso, bajó casi 10 niveles al vacío marino."
    }
];

const DB_COLLECTOR = [
    {
        text: `El caso de los gatos perdidos: \n"A las <span class="selectable-wrap" data-val="dist">4</span> de la tarde fui al callejón Oscuro número <span class="selectable-wrap" data-val="dist">123</span>. Ahí logramos rescatar primero a <span class="selectable-wrap" data-val="useful">14</span> gatos adultos que estaban asustados, y horas más tarde atrapamos una caja con <span class="selectable-wrap" data-val="useful">6</span> gatos bebés."\n\n¿Subraya solo los números útiles para saber cuántos GATOS RESCATARON EN TOTAL?`,
        targetCount: 2,
        explanation: "Las horas ('4 de la tarde') y los números de calle ('callejón 123') eran pistas trampa falsas. Sólo te importaban la cantidad de animales: el 14 y el 6."
    },
    {
        text: `El robo del museo espacial:\n"En el año <span class="selectable-wrap" data-val="dist">3015</span>, hace <span class="selectable-wrap" data-val="dist">2</span> días, el famoso ladrón se robó <span class="selectable-wrap" data-val="useful">45</span> monedas de plata antiguas y, de otra vitrina, <span class="selectable-wrap" data-val="useful">15</span> joyas de la corona."\n\nResalta exclusivamente los números que informan cuántos TESOROS se robó en total.`,
        targetCount: 2,
        explanation: "El año ('3015') y hace cuántos días fue ('2' días) no te sirven de nada para calcular la suma de tesoros robados. Debías marcar las 45 monedas y las 15 joyas."
    },
    {
        text: `El pastel de la bruja:\n"Tengo <span class="selectable-wrap" data-val="dist">8</span> años haciendo esto. Ayer compré <span class="selectable-wrap" data-val="useful">20</span> ojos de rana viscosos, y mi receta de la página <span class="selectable-wrap" data-val="dist">500</span> dice que necesito agregarles <span class="selectable-wrap" data-val="useful">12</span> alas de murciélago."\n\nMarca los números que indican la cantidad de INGREDIENTES en el pastel.`,
        targetCount: 2,
        explanation: "Sus años de experiencia (8) y la página del libro (500) son distracciones inútiles. Los ingredientes eran los 20 ojos y las 12 alas."
    },
    {
        text: `La tropa de hormigas obreras:\n"Para construir nuestro hormiguero número <span class="selectable-wrap" data-val="dist">90</span>, enviamos a <span class="selectable-wrap" data-val="useful">150</span> hormigas soldados fuertes, y luego llegaron como refuerzo <span class="selectable-wrap" data-val="useful">40</span> hormigas constructoras. Terminamos el trabajo a las <span class="selectable-wrap" data-val="dist">6</span> AM."\n\n¿Cuáles son los números clave para saber cuántas HORMIGAS trabajaron juntas?`,
        targetCount: 2,
        explanation: "El número del hormiguero (90) o la hora en que terminaron (6) no dicen cuántos insectos había. Las respuestas correctas eran los 150 soldados y las 40 constructoras."
    },
    {
        text: `Los ahorros del duende:\n"El <span class="selectable-wrap" data-val="dist">30</span> de octubre cumplí <span class="selectable-wrap" data-val="dist">150</span> años de duende mágico. Ese día vacié mis dos alcancías de lata. De una saqué <span class="selectable-wrap" data-val="useful">300</span> monedas doradas, y de la otra, una chiquita, <span class="selectable-wrap" data-val="useful">120</span> monedas de plata."\n\nSubraya únicamente los números vitales para conocer cuán rico en DINERO es el duende.`,
        targetCount: 2,
        explanation: "La fecha del calendario (30) y su edad (150) no son parte de su riqueza o fortuna. Tenías que clickear en sus monedas: 300 de oro y 120 de plata."
    }
];

const DB_SEQUENCE = [
    {
        text: "Los extraterrestres dejaron esta serie de señales luminosas pintadas en la pared de la nave. Encuentra el patrón (qué cuenta se repite) para decidir la última señal y abrir la puerta con ella:",
        sequence: [2, 4, 6, 8],
        answer: 10,
        explanation: "El patrón es muy simple: iban sumando de a DOS (+2) en cada salto. 2, 4, 6, 8... y fnalmente el número 10."
    },
    {
        text: "Misión descifrado. Un reloj en reversa que tiene una bomba funciona con este patrón de tiempo restando minutos. Adivina el que sigue para que podamos desactivarla:",
        sequence: [50, 45, 40, 35],
        answer: 30,
        explanation: "Iban contando hacia atrás (restando) en saltos de CINCO en CINCO (-5). 50, 45, 40, 35... El próximo es el 30."
    },
    {
        text: "Encontramos bacterias mutantes que se clonan rapidísimo en el laboratorio. Mira cómo se multiplican sus poblaciones con un mismo patrón y adivina el tanque final:",
        sequence: [2, 4, 8, 16],
        answer: 32,
        explanation: "En este caso, ¡la población se iba DUPLICANDO! Hacían un (por x 2) cada salto al multiplicarse. El doble de 16 es 32."
    },
    {
        text: "Las estalactitas en la cueva mágica miden de altura un número muy específico siguiendo la Ley de la Suma del '+10'. Entiénde el patrón y dinos cuánto mide la última:",
        sequence: [13, 23, 33, 43],
        answer: 53,
        explanation: "Era fácil de notar: al último dígito (el 3) nunca se lo tocaba, porque iban sumando decenas exactas (saltos de +10). Después de 43, claro, sigue 53."
    },
    {
        text: "Una cuenta regresiva de transbordadores espaciales en la NASA usa códigos súper espaciados restando de a '-100'. Aquí hay 4 plataformas seguidas, ¿cuál es el código de la quinta?",
        sequence: [900, 800, 700, 600],
        answer: 500,
        explanation: "Saltos gigantes en bajada, pero restando de a 100 (-100). Luego del seiscientos (600), la bajada marca lógicamente al quinientos (500)."
    },
    {
        text: "Un sapo salta a través de hojas flotantes enumeradas mágicamente sumando un (+3). Ya hizo 4 saltos, dime qué hoja tocará en su último esfuerzo:",
        sequence: [3, 6, 9, 12],
        answer: 15,
        explanation: "Este es el famoso patrón de la Tabla del 3 (sumar en ciclos de +3). 3... 6... 9... 12... el siguiente es 15."
    }
];

window.GAME_DATABASE = {
    builder: DB_BUILDER,
    approx: DB_APPROX,
    collector: DB_COLLECTOR,
    sequence: DB_SEQUENCE
};
