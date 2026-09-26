import glob
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

for f in sorted(glob.glob('*.html')):
    with open(f, encoding='utf-8') as fh:
        content = fh.read()
    
    # Find all buttons/hotspots with style left and top
    # e.g., class="anatomy-hotspot..." or data-* style="left: ...; top: ...;"
    matches = re.findall(r'<button[^>]*class="([^"]*hotspot[^"]*)"[^>]*style="([^"]*)"([^>]*)>', content)
    # Also check if there are other hotspot patterns like svg or anatomy-point
    svg_points = re.findall(r'<g[^>]*class="anatomy-point"[^>]*>.*?cx="([^"]+)".*?cy="([^"]+)"', content, re.DOTALL)
    
    if matches or svg_points:
        print(f"\n=== File: {f} ===")
        if matches:
            print(f"  Hotspot buttons ({len(matches)}):")
            points = []
            for cls, style, rest in matches:
                left_m = re.search(r'left:\s*([\d\.]+)%', style)
                top_m = re.search(r'top:\s*([\d\.]+)%', style)
                label_m = re.search(r'(?:title|aria-label|data-[a-z-]+)="([^"]+)"', rest)
                label = label_m.group(1) if label_m else 'unknown'
                left = float(left_m.group(1)) if left_m else 0
                top = float(top_m.group(1)) if top_m else 0
                points.append((label, left, top, cls))
                print(f"    - [{label}]: left: {left}%, top: {top}% (class: {cls})")
            
            # Check pairwise distances in percentage space
            for i in range(len(points)):
                for j in range(i + 1, len(points)):
                    p1, p2 = points[i], points[j]
                    dist = ((p1[1] - p2[1])**2 + (p1[2] - p2[2])**2)**0.5
                    if dist < 8.0:
                        print(f"    ⚠️ COLLISION / TOO CLOSE (<8%): '{p1[0]}' and '{p2[0]}' dist={dist:.1f}%")
        
        if svg_points:
            print(f"  SVG anatomy points ({len(svg_points)}):")
            for cx, cy in svg_points:
                print(f"    - cx={cx}, cy={cy}")
