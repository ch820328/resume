import os
import re

slides_dir = 'src/slides'

def remove_chinese(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip special slides or handle them carefully
    if 'id="slide-1"' in content:
        # For profile slide, remove TW parts
        content = re.sub(r'<strong>\[TW\]</strong>.*?(?=<br|</div>|</p>|$)', '', content, flags=re.DOTALL)
        content = re.sub(r'<strong>\[EN\]</strong>', '', content)
        # Final cleanup for profile
        content = content.replace('[EN]', '').replace('[TW]', '')
    else:
        # For project slides
        # Remove [TW] blocks and the [TW] tag
        # Regex: find [EN]...[TW]... and keep only EN
        # This is tricky because of formatting.
        
        # Method 1: Remove everything from [TW] to the next tag or end of line/span
        content = re.sub(r'<strong>\[TW\]</strong>.*?(?=<br|</div>|</span>|$)', '', content, flags=re.DOTALL)
        content = re.sub(r'\[TW\].*?(?=<br|</div>|</span>|$)', '', content, flags=re.DOTALL)
        
        # Method 2: Clean up [EN] tags
        content = re.sub(r'<strong>\[EN\]</strong>', '', content)
        content = re.sub(r'\[EN\]', '', content)

    # Final cleanup for stray <br> at the end of text blocks
    content = re.sub(r'<br\s*/?>\s*</span>', '</span>', content)
    content = re.sub(r'<br\s*/?>\s*</div>', '</div>', content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✅ Removed Chinese from {file_path}")

# Run on all slides
for filename in os.listdir(slides_dir):
    if filename.endswith('.html'):
        remove_chinese(os.path.join(slides_dir, filename))
