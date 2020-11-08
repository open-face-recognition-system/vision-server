import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSubjectStudents1604778841148 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> { }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('subject_students');
  }
}
