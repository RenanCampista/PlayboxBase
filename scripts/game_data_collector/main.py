import requests
import json
from dotenv import load_dotenv
import os
import re

load_dotenv()
API_KEY = os.getenv('RAWG_API_KEY')


class RawgClient:
    """Client for the RAWG Video Games Database API."""
    def __init__(self, api_key: str):
        self.base_url = 'https://api.rawg.io/api'
        self.api_key = api_key

    def format_game_data(self, game: dict, screenshots: list):
        """Format game data for better readability."""
        # Clean HTML tags from description
        raw_description = game.get('description', '')
        clean_description = clean_html_tags(raw_description)
        
        formatted_game = {
                'name': game.get('name'),
                'released': game.get('released'),
                'description': clean_description,
                'background_image': game.get('background_image'),
                'playtime': game.get('playtime'),
                'platforms': self.get_platforms_names(game.get('platforms', [])),
                'genres': self.get_genres_names(game.get('genres', [])),
                'publishers': self.get_publishers_names(game.get('publishers', [])),
                'metacritic': game.get('metacritic'),
                'screenshots': screenshots
            }
        return formatted_game

    def get_platforms_names(self, platforms: list) -> list:
        """Extract platform names from the game data."""
        platforms_names = []
        for platform in platforms:
            name = platform.get('platform', {}).get('name')
            if name:
                platforms_names.append(name)
        return platforms_names
    
    def get_publishers_names(self, publishers: list) -> list:
        """Extract publisher names from the game data."""
        publishers_names = []
        for publisher in publishers:
            name = publisher.get('name')
            if name:
                publishers_names.append(name)
        return publishers_names
    
    def get_genres_names(self, genres: list) -> list:
        """Extract genre names from the game data."""
        genres_names = []
        for genre in genres:
            name = genre.get('name')
            if name:
                genres_names.append(name)
        return genres_names
    
    def get_game_details(self, game_id: int):
        """Fetch detailed information about a specific game."""
        params = {
            'key': self.api_key
        }
        
        try:
            response = requests.get(f'{self.base_url}/games/{game_id}', params=params)
            response.raise_for_status() 
            data = response.json()
            return data
        except requests.exceptions.RequestException as e:
            print(f"Error fetching data: {e}")
            return {}

    def get_games_by_platform(self, platforms: list, page_size: int = 5):
        """Fetch games from the RAWG API based on platforms."""
        params = {
            'key': self.api_key,
            'platforms': ','.join(map(str, platforms)),
            'page_size': page_size
        }
        
        try:
            response = requests.get(f'{self.base_url}/games', params=params)
            response.raise_for_status() 
            data = response.json()
            data['results']
            
            # Details for each game
            games = []
            for game in data['results']:
                game_id = game.get('id')
                game_screenshots = [item['image'] for item in game.get('short_screenshots', [])]
                if game_details := self.get_game_details(game_id):
                    game_details = self.format_game_data(game_details, game_screenshots)
                    games.append(game_details)
                    
            return games
        except requests.exceptions.RequestException as e:
            print(f"Error fetching data: {e}")
            return []
        
    def get_platforms_ids(self):
        """Fetch all platform IDs from the RAWG API."""
        params = {
            'key': self.api_key
        }
        
        try:
            response = requests.get(f'{self.base_url}/platforms', params=params)
            response.raise_for_status() 
            data = response.json()
            return {platform['name']: platform['id'] for platform in data['results']}
        except requests.exceptions.RequestException as e:
            print(f"Error fetching data: {e}")
            return {}


def save_to_json(data, filename='games.json'):
    with open(filename, encoding= 'UTF-8', mode='w') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
        
        
def clean_html_tags(text):
    """Remove HTML tags from text"""
    if not text:
        return ""
    
    # Remove HTML tags
    clean_text = re.sub(r'<[^>]+>', '', text)
    
    # Replace HTML entities
    html_entities = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&apos;': "'",
        '&nbsp;': ' ',
        '&#39;': "'",
        '&#x27;': "'",
        '&#x2F;': '/',
        '&#x5C;': '\\',
        '&#x3D;': '='
    }
    
    for entity, char in html_entities.items():
        clean_text = clean_text.replace(entity, char)
    
    # Remove extra whitespace
    clean_text = ' '.join(clean_text.split())
    
    return clean_text
    
    
if __name__ == "__main__":
    api = RawgClient(API_KEY)
    
    platforms = api.get_platforms_ids()
    platforms_ids = [platform_id for _, platform_id in platforms.items()]
    
    if games := api.get_games_by_platform(platforms_ids, page_size=90):
        save_to_json(games, filename='../../server/data/games.json')
        print(f"Saved {len(games)} games to games.json")
    else:
        print("No games found or an error occurred.")
