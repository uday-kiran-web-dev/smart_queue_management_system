import os

def clean_file(filepath):
    with open(filepath, 'r') as f:
        lines = f.readlines()
    
    new_lines = []
    for line in lines:
        if line.strip().startswith('# --') and len(line.strip()) > 10:
            continue
        new_lines.append(line)
        
    with open(filepath, 'w') as f:
        f.writelines(new_lines)

for root, _, files in os.walk('d:\\IU-Project-Work\\sqms\\backend\\app'):
    for f in files:
        if f.endswith('.py'):
            clean_file(os.path.join(root, f))

print("Cleanup complete!")
