import json

def filter_entries(input_file, output_file, target_standard):
    with open(input_file, 'r') as f:
        data = json.load(f)

    filtered_entries = [entry for entry in data if entry.get('pollutant_standard') == target_standard]

    with open(output_file, 'w') as f:
        json.dump(filtered_entries, f, indent=2)

# Example usage
input_file_path = './moduleOnePollutionData.json'
output_file_path = './cleanedData.json'
target_pollutant_standard = 'PM25 24-hour 2012'

filter_entries(input_file_path, output_file_path, target_pollutant_standard)
