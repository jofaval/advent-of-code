#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <dirent.h>
#include <errno.h>

#define str_equals strcmp

#define INVALID -1
#define VALID 0

#define NOT_EXPECTED_PARAMETERS 1
#define EXPECTED_PARAMETERS 3

#define MAKE "make"
#define RUN "run"
#define NO_ACTION_FOUND 2

#define INVALID_DAY 3
#define MIN_DAY 1
#define MAX_DAY 25

#define DAY_DOES_NOT_EXIST 4
#define FILE_SEPARATOR "/"

int validate_day(char *day)
{
    int int_day = strtol(day, (char **)NULL, 10);
    if (int_day >= MIN_DAY && int_day <= MAX_DAY)
    {
        return VALID;
    }

    printf("Invalid day provided: %s, parsed to %d, it should be (%d >= day <= %d)", day, int_day, MIN_DAY, MAX_DAY);
    return INVALID_DAY;
}

char *get_current_file_path(char *cwd)
{
    if (getcwd(cwd, sizeof(cwd)) != NULL)
    {
        return cwd;
    }
    else
    {
        perror("getcwd() error");
        return "";
    }
}

char *get_file_path_from_day(char *day, char *filepath)
{
    char *cwd = "";
    get_current_file_path(cwd);

    strcat(filepath, cwd);
    strcat(filepath, FILE_SEPARATOR);
    strcat(filepath, day);

    return filepath;
}

int does_day_exist(char *filepath)
{
    DIR *dir = opendir(filepath);
    if (dir)
    {
        closedir(dir);
        return VALID;
    }

    if (ENOENT == errno)
    {
        printf("Directory \"%s\" does not exist", filepath);
    }
    else
    {
        printf("opendir(\"%s\") somehow failed", filepath);
    }

    return INVALID;
}

void get_script_path(char *filepath, char *script_path)
{
    strcat(script_path, filepath);
    strcat(script_path, FILE_SEPARATOR);
    strcat(script_path, "main.c");
}

void generate_script(char *script_path)
{
    FILE *fptr = fopen(script_path, "a");
    fprintf(fptr, "#include <stdio.h>\n#include <string.h>\n#include <stdlib.h>\n\nint main(int argc, char **argv)\n{\n\t\n}\n");
    fclose(fptr);
}

void get_compiler_path(char *filepath, char *compiler_path)
{
    strcat(compiler_path, filepath);
    strcat(compiler_path, FILE_SEPARATOR);
    strcat(compiler_path, "compile.sh");
}

void generate_compiler(char *compiler_path, char *script_path, char *executable_path)
{
    FILE *fptr = fopen(compiler_path, "a");
    fprintf(fptr, "gcc \"%s\" -o \"%s\" \n", script_path, executable_path);
    fclose(fptr);
}

void get_executable_path(char *executable_path)
{
    strcat(compiler_path, filepath);
    strcat(compiler_path, FILE_SEPARATOR);
    strcat(compiler_path, "compiled");
}

void get_run_path(char *filepath, char *run_path)
{
    strcat(run_path, filepath);
    strcat(run_path, FILE_SEPARATOR);
    strcat(run_path, "run.sh");
}

void generate_run(char *run_path, char *executable_path)
{
    FILE *fptr = fopen(run_path, "a");
    fprintf(fptr, "\"%s.exe\"", executable_path);
    fclose(fptr);
}

int create_day(char *filepath)
{
    int dir_creation = mkdir(filepath, 0777);
    if (dir_creation != VALID)
    {
        return INVALID;
    }

    char *script_path;
    get_script_path(filepath, script_path);
    generate_script(script_path);

    char *executable_path;
    get_executable_path(executable_path);

    char *compiler_path;
    get_compiler_path(filepath, compiler_path);
    generate_compiler(compiler_path, script_path, executable_path);

    char *run_path;
    get_run_path(filepath, run_path);
    generate_run(run_path, executable_path);

    return VALID;
}

int make_flow(char *action, char *day)
{
    int is_valid_day = validate_day(day);
    if (is_valid_day != VALID)
    {
        return is_valid_day;
    }

    char *filepath;
    get_file_path_from_day(day, filepath);
    printf("Day path: \"%s\"", filepath);

    if (does_day_exist(filepath) == VALID)
    {
        return VALID;
    }

    return create_day(day);
}

int execute_day(char *filepath)
{
    char *run_path;
    get_run_path(filepath, run_path);

    return system(run_path);
}

int run_flow(char *action, char *day)
{
    int is_valid_day = validate_day(day);
    if (is_valid_day != VALID)
    {
        return is_valid_day;
    }

    char *filepath;
    get_file_path_from_day(day, filepath);

    if (does_day_exist(filepath) != VALID)
    {
        printf("Day %s does not exist", day);
        // TODO: Offer day creation?
        return DAY_DOES_NOT_EXIST;
    }

    return execute_day(filepath);
}

int get_array_len(char **arguments)
{
    int count = 0;
    while (arguments[++count] != NULL)
    {
    }

    return count;
}

int main(int argc, char **argv)
{
    int args_len = get_array_len(argv);
    if (args_len != EXPECTED_PARAMETERS)
    {
        printf("Not the expected amount of parameters, %i provided", args_len);
        return NOT_EXPECTED_PARAMETERS;
    }

    char *action = argv[1];
    char *day = argv[2];

    if (str_equals(action, MAKE))
    {
        return make_flow(action, day);
    }
    else if (str_equals(action, RUN))
    {
        return run_flow(action, day);
    }
    else
    {
        printf("Unknown action given, %s provided");
        return NO_ACTION_FOUND;
    }
}