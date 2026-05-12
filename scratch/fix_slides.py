import os
import re

slides_dir = 'src/slides'
template_file = 'src/slides/00_project_template.html'

def fix_html(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract slide ID and title parts
    section_match = re.search(r'<section class="slide" id="(.*?)">', content)
    if not section_match:
        return
    slide_id = section_match.group(1)

    title_match = re.search(r'<h2 class="slide-title">(.*?)</h2>', content)
    slide_title = title_match.group(1) if title_match else ""

    tag_match = re.search(r'<span class="slide-tag">(.*?)</span>', content)
    slide_tag = tag_match.group(1) if tag_match else ""

    # Extract STAR cards
    cards = re.findall(r'(<div class="star-card">.*?</div>)', content, re.DOTALL)
    
    # Extract tech tags
    tech_tags = re.findall(r'<span class="tech-tag">(.*?)</span>', content)
    
    # Extract visual (img or custom div)
    visual_match = re.search(r'<div class="star-visual">(.*?)</div>\s*</div>', content, re.DOTALL)
    if not visual_match:
        # Try another pattern if visual is different
        visual_match = re.search(r'<div class="star-visual">(.*?)</div>', content, re.DOTALL)
    
    visual_content = visual_match.group(1).strip() if visual_match else ""

    # Reconstruct
    new_content = f"""<section class="slide" id="{slide_id}">
    <div class="content-wrapper">
        <div class="slide-header-row">
            <h2 class="slide-title">{slide_title}</h2>
            <span class="slide-tag">{slide_tag}</span>
        </div>
        <div class="star-grid">
            <div class="star-content">
"""
    for card in cards:
        new_content += f"                {card.strip()}\n"
    
    new_content += """            </div>
            
            <div class="tech-footer">
"""
    for tag in tech_tags:
        new_content += f'                <span class="tech-tag">{tag}</span>\n'
    
    new_content += f"""            </div>
            <div class="star-visual">
                {visual_content}
            </div>
        </div>
    </div>
</section>"""

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"✅ Fixed {file_path}")

# Run on all slides
for filename in os.listdir(slides_dir):
    if filename.endswith('.html'):
        fix_html(os.path.join(slides_dir, filename))
