CREATE PROCEDURE GetPersonsByTaskId
    @TaskId INT
AS
BEGIN
    SELECT p.PersonId, p.FullName, p.Age, p.Skills
    FROM Person p
    WHERE p.TaskId = @TaskId;
END