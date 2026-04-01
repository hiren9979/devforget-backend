const path = require("path");

module.exports = function (plop) {
    plop.setGenerator("crud", {
        description: "Generate CRUD module (controller + db + routes)",
        prompts: [
            {
                type: "input",
                name: "module",
                message: "Module name (e.g. demo, email, user):",
            },
        ],
        actions: [
            // Controller
            {
                type: "add",
                path: "../controllers/{{module}}/{{module}}Controller.js",
                templateFile: "templates/controller.hbs",
            },

            // DB
            {
                type: "add",
                path: "../db/{{module}}/{{module}}.js",
                templateFile: "templates/db.hbs",
            },

            // Routes
            {
                type: "add",
                path: "../routes/{{module}}/{{module}}Routes.js",
                templateFile: "templates/route.hbs",
            },

            {
                type: "append",
                path: path.join(process.cwd(), "routes/routes.js"),
                pattern: /const router = express\.Router\(\);\n/,
                template: "const {{module}}Routes = require('./{{module}}/{{module}}Routes');\n",
                abortOnFail: false,
            }

        ],
    });
};
