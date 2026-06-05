import { Pokemon } from './pokemon';

export const POKEMONS: Pokemon[] = [
    { id: 1,  name: "Bulbizarre", hp: 25, cp: 5,  picture: "https://qvexmeaxafazljnlsjbi.supabase.co/storage/v1/object/public/pokedex/small/1.webp",  types: ["Plante", "Poison"], rarity: 2, isFavorite: false, created: new Date() },
    { id: 2,  name: "Salamèche", hp: 28, cp: 6,  picture: "https://qvexmeaxafazljnlsjbi.supabase.co/storage/v1/object/public/pokedex/small/4.webp",  types: ["Feu"],             rarity: 3, isFavorite: false, created: new Date() },
    { id: 3,  name: "Carapuce",  hp: 21, cp: 4,  picture: "https://qvexmeaxafazljnlsjbi.supabase.co/storage/v1/object/public/pokedex/small/7.webp",  types: ["Eau"],             rarity: 3, isFavorite: false, created: new Date() },
    { id: 4,  name: "Aspicot",   hp: 16, cp: 2,  picture: "https://qvexmeaxafazljnlsjbi.supabase.co/storage/v1/object/public/pokedex/small/13.webp", types: ["Insecte","Poison"],rarity: 1, isFavorite: false, created: new Date() },
    { id: 5,  name: "Roucool",   hp: 30, cp: 7,  picture: "https://qvexmeaxafazljnlsjbi.supabase.co/storage/v1/object/public/pokedex/small/16.webp", types: ["Normal","Vol"],    rarity: 2, isFavorite: false, created: new Date() },
    { id: 6,  name: "Rattata",   hp: 18, cp: 6,  picture: "https://qvexmeaxafazljnlsjbi.supabase.co/storage/v1/object/public/pokedex/small/19.webp", types: ["Normal"],          rarity: 1, isFavorite: false, created: new Date() },
    { id: 7,  name: "Piafabec",  hp: 14, cp: 5,  picture: "https://qvexmeaxafazljnlsjbi.supabase.co/storage/v1/object/public/pokedex/small/21.webp", types: ["Normal","Vol"],    rarity: 1, isFavorite: false, created: new Date() },
    { id: 8,  name: "Abo",       hp: 16, cp: 4,  picture: "https://qvexmeaxafazljnlsjbi.supabase.co/storage/v1/object/public/pokedex/small/23.webp", types: ["Poison"],          rarity: 2, isFavorite: false, created: new Date() },
    { id: 9,  name: "Pikachu",   hp: 21, cp: 7,  picture: "https://qvexmeaxafazljnlsjbi.supabase.co/storage/v1/object/public/pokedex/small/25.webp", types: ["Electrik"],        rarity: 4, isFavorite: true,  created: new Date() },
    { id: 10, name: "Sabelette", hp: 19, cp: 3,  picture: "https://qvexmeaxafazljnlsjbi.supabase.co/storage/v1/object/public/pokedex/small/27.webp", types: ["Normal"],          rarity: 2, isFavorite: false, created: new Date() },
    { id: 11, name: "Mélofée",   hp: 25, cp: 5,  picture: "https://qvexmeaxafazljnlsjbi.supabase.co/storage/v1/object/public/pokedex/small/35.webp", types: ["Fée"],             rarity: 4, isFavorite: false, created: new Date() },
    { id: 12, name: "Groupix",   hp: 17, cp: 8,  picture: "https://qvexmeaxafazljnlsjbi.supabase.co/storage/v1/object/public/pokedex/small/37.webp", types: ["Feu"],             rarity: 3, isFavorite: false, created: new Date() }
];
