import path from "path";
import "reflect-metadata";
import { DataSource, DataTypeNotSupportedError } from "typeorm";
import * as Models from "../entities";
import { Migration } from "../entities/Migration";
import { yellow, green, red } from "picocolors";

// UUID extension option is only supported with postgres
// We want to generate all id's with Snowflakes that's why we have our own BaseEntity class

let promise: Promise<any>;
let dbConnection: DataSource | undefined;
let dbConnectionString = process.env.DATABASE || path.join(process.cwd(), "database.db");

export function initDatabase(): Promise<DataSource> {
	if (promise) return promise; // prevent initalizing multiple times

	const type = dbConnectionString.includes("://") ? dbConnectionString.split(":")[0]?.replace("+srv", "") : "sqlite";
	const isSqlite = type.includes("sqlite");

	console.log(`[Database] ${yellow(`connecting to ${type} db`)}`);
	if (isSqlite) {
		console.log(`[Database] ${red(`You are running sqlite! Please keep in mind that we recommend setting up a dedicated database!`)}`);
	}

	const datasource = new DataSource({
		//@ts-ignore
		type: type,
		charset: 'utf8mb4',
		url: isSqlite ? undefined : dbConnectionString,
		database: isSqlite ? dbConnectionString : undefined,
		//@ts-ignore
		entities: Object.values(Models).filter((x) => x.constructor.name !== "Object" && x.name),
		synchronize: type !== "mongodb",
		logging: false,
		cache: {
			duration: 1000 * 3,
		},
		bigNumberStrings: false,
		supportBigNumbers: true,
		name: "default",
		migrations: [path.join(__dirname, "..", "migrations", "*.js")],
	});

	promise = datasource.initialize();

	promise.then(async (connection: DataSource) => {
		dbConnection = connection;

		// run migrations, and if it is a new fresh database, set it to the last migration
		if (connection.migrations.length) {
			if (!(await Migration.findOne({}))) {
				let i = 0;

				await Migration.insert(
					connection.migrations.map((x) => ({
						id: i++,
						name: x.name,
						timestamp: Date.now(),
					}))
				);
			}
		}
		await connection.runMigrations();
		console.log(`[Database] ${green("connected")}`);
	});

	return promise;
}

export { dbConnection };

export function closeDatabase() {
	dbConnection?.close();
}
