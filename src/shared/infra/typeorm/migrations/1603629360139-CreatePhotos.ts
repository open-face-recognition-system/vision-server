import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreatePhotos1603629360139 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'photos',
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
            name: 'photoType',
            type: 'enum',
            enum: [
              'normal',
              'smilling',
              'closedEyes',
              'rightSide',
              'leftSide',
              'withoutGlasses',
            ],
            enumName: 'photoType',
          },
          {
            name: 'student_id',
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
            name: 'PhotoUser',
            referencedTableName: 'students',
            referencedColumnNames: ['id'],
            columnNames: ['student_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('photos');
  }
}
