import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddRecognitionFileToSubject1608988628007
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'subjects',
      new TableColumn({
        name: 'recognition_file_id',
        type: 'int',
        isNullable: true,
      }),
    );
    await queryRunner.createForeignKey(
      'subjects',
      new TableForeignKey({
        name: 'SubjectRecognitionFile',
        referencedTableName: 'recognition_files',
        referencedColumnNames: ['id'],
        columnNames: ['recognition_file_id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('subjects', 'SubjectRecognitionFile');
    await queryRunner.dropColumn('subjects', 'recognition_file_id');
  }
}
