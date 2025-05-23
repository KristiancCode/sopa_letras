### 🏆 **Flujo del Juego de Sopa de Letras en Tiempo Real** 🏆

#### **1️⃣ Creación de la Sala**

- El administrador del juego **crea una sala** con el código `"D13LZW"` en el **FrontEnd**.
- El **BackEnd** recibe este código y el nombre del administrador a través de un endpoint.

#### **2️⃣ Ingreso de Jugadores**

- En el **FrontEnd**, el administrador accede a la sala y observa una lista de jugadores en tiempo real.
- Los jugadores **envían su nombre** al **BackEnd**, que los **agrega** a la lista de la sala.
- El **BackEnd** **notifica** al **FrontEnd** cada vez que un nuevo jugador se une, actualizando la lista.

#### **3️⃣ Inicio del Juego**

- Cuando el administrador considera que hay suficientes jugadores, **presiona "Iniciar Juego"**.
- El **FrontEnd envía la señal al BackEnd**.
- El **BackEnd emite una notificación global** a todos los jugadores para que el juego comience en sus pantallas.

#### **4️⃣ Desarrollo del Juego**

- Los jugadores intentan completar todas las palabras de la sopa de letras.
- Cuando un jugador **termina la sopa**, el **FrontEnd envía su nombre al BackEnd**.

#### **5️⃣ Detección de Ganadores**

- El **BackEnd almacena los nombres** de los jugadores que han completado el juego.
- Cuando el **tercer jugador completa la sopa**, el **BackEnd envía un aviso global** al **FrontEnd** notificando que hay **3 ganadores**.

### 🔗 **Resumen del EndPoints del BackEnd**

| Endpoint        | Método | Descripción                                                |
| --------------- | ------ | ---------------------------------------------------------- |
| `/createRoom`   | `POST` | Recibe el código de la sala y el nombre del administrador. |
| `/joinRoom`     | `POST` | Recibe el nombre del jugador y lo agrega a la lista.       |
| `/startGame`    | `POST` | Activa el juego para todos los jugadores.                  |
| `/submitWinner` | `POST` | Recibe el nombre del jugador cuando completa la sopa.      |
| `/gameStatus`   | `GET`  | Devuelve el estado del juego y los ganadores.              |
