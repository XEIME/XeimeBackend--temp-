import { url } from "node:inspector";
import { Options } from "swagger-jsdoc";
import swaggerJSDoc from "swagger-jsdoc";
import packageJson from '../../package.json' assert {type: 'json'};

const options: Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'XEIME API',
            version: packageJson.version,
            description: 'Sistema Integrado de Gestão Escolar para Moçambique',
            contact: {
                name: 'Marcos Higildo Muangula',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                decription: 'Servidor local',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },

    apis: ['./src/routes/*.ts', './src/index.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
