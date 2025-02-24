import { MigrationInterface, QueryRunner } from "typeorm";

export class updatedApplications1660130586602 implements MigrationInterface {
    name = 'updatedApplications1660130586602'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`applications\` DROP FOREIGN KEY \`FK_e5bf78cdbbe9ba91062d74c5aba\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\` DROP COLUMN \`rpc_origins\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\` DROP COLUMN \`primary_sku_id\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\` DROP COLUMN \`slug\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\` DROP COLUMN \`guild_id\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\`
            ADD \`type\` text NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\`
            ADD \`hook\` tinyint NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\`
            ADD \`redirect_uris\` text NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\`
            ADD \`rpc_application_state\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\`
            ADD \`store_application_state\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\`
            ADD \`verification_state\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\`
            ADD \`interactions_endpoint_url\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\`
            ADD \`integration_public\` tinyint NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\`
            ADD \`integration_require_code_grant\` tinyint NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\`
            ADD \`discoverability_state\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\`
            ADD \`discovery_eligibility_flags\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\`
            ADD \`tags\` text NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\`
            ADD \`install_params\` text NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\`
            ADD \`bot_user_id\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\`
            ADD UNIQUE INDEX \`IDX_2ce5a55796fe4c2f77ece57a64\` (\`bot_user_id\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\` CHANGE \`description\` \`description\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\` DROP COLUMN \`flags\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\`
            ADD \`flags\` int NOT NULL
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`REL_2ce5a55796fe4c2f77ece57a64\` ON \`applications\` (\`bot_user_id\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\`
            ADD CONSTRAINT \`FK_2ce5a55796fe4c2f77ece57a647\` FOREIGN KEY (\`bot_user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`applications\` DROP FOREIGN KEY \`FK_2ce5a55796fe4c2f77ece57a647\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_2ce5a55796fe4c2f77ece57a64\` ON \`applications\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\` DROP COLUMN \`flags\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\`
            ADD \`flags\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\` CHANGE \`description\` \`description\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\` DROP INDEX \`IDX_2ce5a55796fe4c2f77ece57a64\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\` DROP COLUMN \`bot_user_id\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\` DROP COLUMN \`install_params\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\` DROP COLUMN \`tags\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\` DROP COLUMN \`discovery_eligibility_flags\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\` DROP COLUMN \`discoverability_state\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\` DROP COLUMN \`integration_require_code_grant\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\` DROP COLUMN \`integration_public\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\` DROP COLUMN \`interactions_endpoint_url\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\` DROP COLUMN \`verification_state\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\` DROP COLUMN \`store_application_state\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\` DROP COLUMN \`rpc_application_state\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\` DROP COLUMN \`redirect_uris\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\` DROP COLUMN \`hook\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\` DROP COLUMN \`type\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\`
            ADD \`guild_id\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\`
            ADD \`slug\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\`
            ADD \`primary_sku_id\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\`
            ADD \`rpc_origins\` text NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`applications\`
            ADD CONSTRAINT \`FK_e5bf78cdbbe9ba91062d74c5aba\` FOREIGN KEY (\`guild_id\`) REFERENCES \`guilds\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
