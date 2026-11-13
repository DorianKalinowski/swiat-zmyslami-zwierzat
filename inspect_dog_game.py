import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('js/dog-simulators.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

in_game = False
game_lines = []
for i, line in enumerate(lines):
    if 'MINIGAME' in line or 'initDogScentGame' in line:
        in_game = True
    if 'QUIZ' in line or 'initDogQuiz' in line:
        in_game = False
    if in_game:
        game_lines.append((i+1, line))

print(f"Game section lines: {len(game_lines)}")
for num, l in game_lines[:80]:
    print(f"{num}: {l}", end="")
