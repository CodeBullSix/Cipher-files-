with open('firestore.rules', 'r') as f:
    content = f.read()

# Fix the broken /messages/{messageId} match block
import re
bad_messages_rule = r"match /messages/\{messageId\} \{\s*allow get: if isOwner\(userId\) \|\| isAdmin\(\) \|\| isModerator\(\);\s*allow list: if isAdmin\(\);"
fixed_messages_rule = "match /messages/{messageId} {\n        allow get, list: if isSignedIn() && (request.auth.uid in get(/databases/$(database)/documents/conversations/$(conversationId)).data.participants || isAdmin());"

content = re.sub(bad_messages_rule, fixed_messages_rule, content)

# Fix the conversations list rule
# allow list: if isSignedIn();
conversations_list_rule = r"match /conversations/\{conversationId\} \{\s*allow get: if isSignedIn\(\) && \(request\.auth\.uid in resource\.data\.participants \|\| isAdmin\(\)\);\s*allow list: if isSignedIn\(\);"
fixed_conversations_list_rule = "match /conversations/{conversationId} {\n      allow get: if isSignedIn() && (request.auth.uid in resource.data.participants || isAdmin());\n      allow list: if isSignedIn() && request.auth.uid in resource.data.participants;"
content = re.sub(conversations_list_rule, fixed_conversations_list_rule, content)

with open('firestore.rules', 'w') as f:
    f.write(content)
