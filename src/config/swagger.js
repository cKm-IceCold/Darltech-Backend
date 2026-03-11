const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Darltech Academy API',
            version: '1.0.0',
            description: 'API documentation for Darltech Academy LMS Backend. This documentation explains how to consume the endpoints for Authentication, along with future endpoints.',
            contact: {
                name: 'Darltech Academy',
            },
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
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
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    // Paths to files containing OpenAPI definitions
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
