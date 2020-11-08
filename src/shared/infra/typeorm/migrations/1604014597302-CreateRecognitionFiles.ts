import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateRecognitionFiles1604017427302
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'recognition_files',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'path',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'subject_id',
            type: 'int',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'RecognitionFileSubject',
            referencedTableName: 'subject',
            referencedColumnNames: ['id'],
            columnNames: ['subject_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('recognition_files');
  }
}
