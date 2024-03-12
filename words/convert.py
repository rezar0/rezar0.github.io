import json
from collections import defaultdict

# Load the JSON data from the file
def load_json(filename):
    with open(filename, 'r') as file:
        return json.load(file)

# Group strings by their first letter
def group_strings_by_first_letter(data):
    grouped = defaultdict(list)
    for item in data:
        if isinstance(item, str):  # Ensure item is a string
            first_letter = item[0].lower()  # Use the first letter, case-insensitive
            grouped[first_letter].append(item)
    return grouped

# Write each group to a separate file
def write_groups_to_files(grouped_data):
    for first_letter, items in grouped_data.items():
        output_directory = r'c:/Users/Braum/Desktop/Website/WordVine/'
        filename = f'{output_directory}{first_letter}_group.json'

        with open(filename, 'w') as file:
            json.dump(items, file, indent=2)
        print(f"Group '{first_letter}' written to {filename}")

# Main function to tie the steps together
def main(input_filename):
    data = load_json(input_filename)
    grouped_data = group_strings_by_first_letter(data)
    write_groups_to_files(grouped_data)
# Replace 'your_input_file.json' with your actual input file name
input_filename = r'c:/Users/Braum/Desktop/Website/WordVine/output.json'
main(input_filename)
