# language: es
Característica: colab solo responde a quien trae la contraseña

  Las tres APIs exigen contraseña, frenan la fuerza bruta y solo reenvían al
  gateway los modelos de la lista. El código que genera un modelo no comparte
  origen con la app.

  Escenario: La interfaz se sirve en la raíz, sin contraseña para verla
    Cuando pido GET / sin contraseña
    Entonces la respuesta es 200
    Y el cuerpo contiene "Pixan genAI"

  Esquema del escenario: Las APIs de genAI exigen la contraseña
    Cuando pido <método> <ruta> <credencial>
    Entonces la respuesta es <estado>

    Ejemplos:
      | método | ruta                      | credencial                      | estado |
      | POST   | /api/chat                 | sin contraseña                  | 401    |
      | POST   | /api/chat                 | con la contraseña "incorrecta"  | 401    |
      | POST   | /api/chat                 | con la contraseña correcta      | 200    |
      | POST   | /api/generate-infographic | sin contraseña                  | 401    |
      | POST   | /api/generate-infographic | con la contraseña "incorrecta"  | 401    |
      | POST   | /api/generate-infographic | con la contraseña correcta      | 200    |
      | GET    | /api/credits              | sin contraseña                  | 401    |
      | GET    | /api/credits              | con la contraseña "incorrecta"  | 401    |
      | GET    | /api/credits              | con la contraseña correcta      | 200    |

  Escenario: La contraseña solo vale en la cabecera, no en el cuerpo
    Cuando pido POST /api/chat con la contraseña correcta en el cuerpo
    Entonces la respuesta es 401

  Esquema del escenario: Cinco fallos seguidos bloquean a esa IP
    Dado que una IP ha fallado la contraseña <fallos> veces
    Cuando esa IP pide POST /api/chat con la contraseña correcta
    Entonces la respuesta es <estado>

    Ejemplos:
      | fallos | estado |
      | 4      | 200    |
      | 5      | 429    |
      | 9      | 429    |

  Escenario: El bloqueo avisa cuándo reintentar
    Dado que una IP ha fallado la contraseña 5 veces
    Cuando esa IP pide GET /api/credits con la contraseña correcta
    Entonces la respuesta es 429
    Y la respuesta trae la cabecera Retry-After

  Escenario: El bloqueo de una IP no alcanza a otra
    Dado que una IP ha fallado la contraseña 5 veces
    Cuando otra IP pide POST /api/chat con la contraseña correcta
    Entonces la respuesta es 200

  Escenario: Acertar la contraseña borra los fallos anteriores
    Dado que una IP ha fallado la contraseña 4 veces
    Y esa IP pide POST /api/chat con la contraseña correcta
    Y esa IP ha fallado la contraseña 4 veces
    Cuando esa IP pide POST /api/chat con la contraseña correcta
    Entonces la respuesta es 200

  Esquema del escenario: Solo los modelos de la lista llegan al gateway
    Cuando pido a /api/chat el modelo "<modelo>" con la contraseña correcta
    Entonces la respuesta es <estado>
    Y el gateway recibió <llamadas> llamadas con ese modelo

    Ejemplos:
      | modelo                                     | estado | llamadas |
      | anthropic/claude-opus-4-5                  | 200    | 1        |
      | anthropic/claude-sonnet-4.5                | 200    | 1        |
      | openai/gpt-5.2                             | 200    | 1        |
      | google/gemini-3-flash-preview              | 200    | 1        |
      | google/gemini-2.0-flash-thinking-exp-1219  | 200    | 1        |
      | google/gemini-2.5-flash                    | 200    | 1        |
      | perplexity/sonar-pro                       | 200    | 1        |
      | deepseek/deepseek-v3.2-exp-thinking        | 200    | 1        |
      | xai/grok-4.1-fast-reasoning                | 200    | 1        |
      | moonshotai/kimi-k2-thinking                | 200    | 1        |
      | openai/gpt-5.2-pro                         | 400    | 0        |
      | anthropic/claude-fable-5                   | 400    | 0        |
      | google/gemini-3-pro-image                  | 400    | 0        |

  Escenario: Lo que llega al gateway lleva un tope de tokens
    Cuando pido a /api/chat el modelo "openai/gpt-5.2" con la contraseña correcta
    Entonces el gateway recibió esa llamada con max_tokens de 4000 como máximo

  Esquema del escenario: Sin contraseña configurada en el servidor, nadie entra
    Dado un servidor sin AUTH_PASSWORD
    Cuando pido <método> <ruta> <credencial>
    Entonces la respuesta es 401

    Ejemplos:
      | método | ruta                      | credencial                     |
      | POST   | /api/chat                 | sin contraseña                 |
      | POST   | /api/chat                 | con la contraseña "undefined"  |
      | POST   | /api/chat                 | con la contraseña ""           |
      | GET    | /api/credits              | con la contraseña "undefined"  |
      | POST   | /api/generate-infographic | con la contraseña ""           |

  Esquema del escenario: El código generado por un modelo no comparte origen con la app
    Entonces el archivo components/AppPreview.js <condición> "<texto>"

    Ejemplos:
      | condición   | texto                  |
      | no contiene | allow-same-origin      |
      | contiene    | '_blank', 'noopener')  |

  Escenario: El ejemplo de variables de entorno no trae valores
    Entonces ninguna variable de .env.example tiene valor

  Escenario: No queda rastro del aviso de visitas
    Entonces ningún archivo de pages, components o lib contiene "track-visit"

  Escenario: El sitio corre una versión de Next.js que recibe parches de seguridad
    Entonces la versión instalada de next es 16.4.6 o posterior
