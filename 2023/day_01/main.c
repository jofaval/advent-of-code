#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#define PRODUCTION_DATA 1
#define TEST_DATA 2

#define FIRST_PART 1
#define SECOND_PART 2

// TODO: define base path automatically in day generation

int main(int argc, char **argv)
{
    int data_type = PRODUCTION_DATA;

    // TODO: research segmentation fault
    char filepath[255], data_path[] = "D:\\Pepe\\WebDesign\\xampp\\htdocs\\advent-of-code\\2023\\day_01\\data";
    strcat(filepath, data_path);

    char *data_file;
    switch (data_type)
    {
    case PRODUCTION_DATA:
        data_file = "prod.txt";
    case TEST_DATA:
        data_file = "test.txt";

    default:
        data_file = "prod.txt";
    }

    strcat(filepath, data_file);

    FILE *fp = fopen("D:\\Pepe\\WebDesign\\xampp\\htdocs\\advent-of-code\\2023\\day_01\\data\\prod.txt", "r");
    if (fp == NULL)
    {
        perror("Failed: ");
        return 1;
    }

    char buffer[255];
    while (fgets(buffer, 255, fp))
    {
        buffer[strcspn(buffer, "\n")] = 0;
        printf("%s\n", buffer);

        int len = strlen(buffer);
        for (size_t i = 0; i < len; i++)
        {
            int character = buffer[i];
            printf("%d", character);
        }
    }

    fclose(fp);
    return 0;
}
