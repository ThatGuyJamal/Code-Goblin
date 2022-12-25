// https://pm2.keymetrics.io/docs/usage/application-declaration/
module.exports = {
	apps: [
		{
			name: "Whisper Room Landing",
			script: "./dist/index.js",
			max_memory_restart: "450M",
			env_production: {
				NODE_ENV: "production",
			},
			env_development: {
				NODE_ENV: "development",
			},
			max_restarts: 5,
			restart_delay: 0,
			autorestart: true,
		},
	],
};