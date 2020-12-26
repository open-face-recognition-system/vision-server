import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class RemoveSubjectIdFromRecognitionFiles1608986791979
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'recognition_files',
      'RecognitionFileSubject',
    );
    await queryRunner.dropColumn('recognition_files', 'subject_id');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'recognition_files',
      new TableColumn({
        name: 'subject_id',
        type: 'int',
      }),
    );
    await queryRunner.createForeignKey(
      'recognition_files',
      new TableForeignKey({
        name: 'RecognitionFileSubject',
        referencedTableName: 'subjects',
        referencedColumnNames: ['id'],
        columnNames: ['subject_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }
}
