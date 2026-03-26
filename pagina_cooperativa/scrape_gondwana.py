import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

url = "https://gondwana.ar"
output_dir = "/Users/ignacioescapa/Desktop/ANTIGRAVITY/pagina cooperativa"
os.makedirs(output_dir, exist_ok=True)

try:
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Extract text content to save
    with open(os.path.join(output_dir, "site_content.txt"), "w", encoding="utf-8") as f:
        f.write(soup.get_text(separator="\n", strip=True))
        
    img_tags = soup.find_all('img')
    print(f"Found {len(img_tags)} images on {url}")
    
    for i, img in enumerate(img_tags):
        img_url = img.get('src')
        if not img_url:
            # Check for data-src or srcset if lazy loaded
            img_url = img.get('data-src') or img.get('data-lazy-src')
            if not img_url:
                continue
            
        img_url = urljoin(url, img_url)
        parsed_url = urlparse(img_url)
        filename = os.path.basename(parsed_url.path)
        if not filename:
            filename = f"image_{i}.png"
            
        filepath = os.path.join(output_dir, filename)
        
        try:
            img_data = requests.get(img_url, timeout=10).content
            with open(filepath, 'wb') as f:
                f.write(img_data)
            print(f"Downloaded {filename}")
        except Exception as e:
            print(f"Failed to download {img_url}: {e}")
            
except Exception as e:
    print(f"Error scraping {url}: {e}")
