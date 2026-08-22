import re

with open('src/routes/evidence.ts', 'r') as f:
    content = f.read()

# We need to move the /:id and related GET/POST that take generic IDs to the bottom.
# Actually, the simplest way is to replace router.get('/:id' with router.get('/item/:id'
# Wait, if we change the API path, we have to change the frontend.
# It's better to just reorder the code.

def extract_block(text, start_str):
    start_idx = text.find(start_str)
    if start_idx == -1: return ""
    
    # Simple brace matching
    brace_count = 0
    in_block = False
    
    for i in range(start_idx, len(text)):
        if text[i] == '{':
            brace_count += 1
            in_block = True
        elif text[i] == '}':
            brace_count -= 1
            if in_block and brace_count == 0:
                # Need to also include the trailing });
                end_idx = text.find(';', i) + 1
                return text[start_idx:end_idx]
    return ""

get_id_block = extract_block(content, "router.get('/:id'")
post_verify_block = extract_block(content, "router.post('/:id/verify'")

new_content = content.replace(get_id_block, "").replace(post_verify_block, "")

# Append them at the end before export default router;
new_content = new_content.replace("export default router;", f"{get_id_block}\n\n{post_verify_block}\n\nexport default router;")

with open('src/routes/evidence.ts', 'w') as f:
    f.write(new_content)
