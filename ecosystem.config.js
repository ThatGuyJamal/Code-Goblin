// https://pm2.keymetrics.io/docs/usage/application-declaration/
module.exports = [
	{
		name: "Whisper Room Bot",
		script: "./dist/index.js",
		max_memory_restart: "400",
		env_production: {
			NODE_ENV: "production",
		},
		env_development: {
			NODE_ENV: "development",
		},
		exec_mode   : 'fork', 
		max_restarts: 5,
		restart_delay: 0,
		autorestart: true,
		log_file: 'bot.log',
		exec_interpreter: 'node',
	},
];