import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const conjuntos = {
    A: ["Ana", "Bruno", "Carla", "Daniel"],
    B: ["Bruno", "Eduarda", "Fábio", "Gabriela"],
    C: ["Ana", "Gabriela", "Heitor", "Isabela"],
    D: ["Carla", "Eduarda", "Isabela", "João"]
};

const questions = [
    {
        question: "Quem gosta de música clássica e jazz ao mesmo tempo (interseção de A e B)?",
        answer: "Bruno"
    },
    {
        question: "Quem gosta de música clássica ou jazz (união de A e B)?",
        answer: "Ana"
    },
    {
        question: "Quem gosta apenas de música clássica, mas não de jazz (diferença de A e B)?",
        answer: "Daniel"
    },
    {
        question: "Quem gosta de rock e não gosta de música eletrônica (diferença de C e D)?",
        answer: "Heitor"
    },
    {
        question: "Quem gosta de música eletrônica ou jazz, mas não de música clássica (união de B e D excluindo A)?",
        answer: "Eduarda"
    }
];

const MathHangman = () => {
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [word, setWord] = useState([]);
    const [guessedLetters, setGuessedLetters] = useState([]);
    const [incorrects, setIncorrects] = useState(0);
    const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
    const [guess, setGuess] = useState('');

    const hangmanStages = [
        `
           --------
           |      |
           |      
           |    
           |      
           |     
           -
        `,
        `
           --------
           |      |
           |      O
           |    
           |      
           |     
           -
        `,
        `
           --------
           |      |
           |      O
           |      |
           |      |
           |     
           -
        `,
        `
           --------
           |      |
           |      O
           |     \\|
           |      |
           |     
           -
        `,
        `
           --------
           |      |
           |      O
           |     \\|/
           |      |
           |     
           -
        `,
        `
           --------
           |      |
           |      O
           |     \\|/
           |      |
           |     / 
           -
        `,
        `
           --------
           |      |
           |      O
           |     \\|/
           |      |
           |     / \\
           -
        `
    ];

    const initializeGame = () => {
        const randomIndex = Math.floor(Math.random() * questions.length);
        setCurrentQuestion(questions[randomIndex]);
        setWord(Array(questions[randomIndex].answer.length).fill('_'));
        setGuessedLetters([]);
        setIncorrects(0);
        setGameStatus('playing');
        setGuess('');
    };

    useEffect(() => {
        initializeGame();
    }, []);

    const handleGuess = () => {
        if (!guess || guessedLetters.includes(guess.toLowerCase())) {
            return;
        }

        const newGuessedLetters = [...guessedLetters, guess.toLowerCase()];
        setGuessedLetters(newGuessedLetters);

        if (currentQuestion.answer.toLowerCase().includes(guess.toLowerCase())) {
            const newWord = [...word];
            for (let i = 0; i < currentQuestion.answer.length; i++) {
                if (currentQuestion.answer[i].toLowerCase() === guess.toLowerCase()) {
                    newWord[i] = currentQuestion.answer[i];
                }
            }
            setWord(newWord);

            if (!newWord.includes('_')) {
                setGameStatus('won');
            }
        } else {
            const newIncorrects = incorrects + 1;
            setIncorrects(newIncorrects);
            if (newIncorrects >= 6) {
                setGameStatus('lost');
            }
        }
        setGuess('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleGuess();
        }
    };

    if (!currentQuestion) return null;

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Jogo da Forca - Teoria dos Conjuntos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-slate-100 p-4 rounded-lg">
                    <p className="text-sm font-medium mb-2">Conjuntos:</p>
                    <p>A = {"{"}Ana, Bruno, Carla, Daniel{"}"} (Música Clássica)</p>
                    <p>B = {"{"}Bruno, Eduarda, Fábio, Gabriela{"}"} (Jazz)</p>
                    <p>C = {"{"}Ana, Gabriela, Heitor, Isabela{"}"} (Rock)</p>
                    <p>D = {"{"}Carla, Eduarda, Isabela, João{"}"} (Eletrônica)</p>
                </div>

                <div className="bg-slate-100 p-4 rounded-lg">
                    <pre className="font-mono text-sm">{hangmanStages[incorrects]}</pre>
                </div>

                <div className="text-center text-2xl font-mono space-x-2">
                    {word.map((letter, index) => (
                        <span key={index} className="inline-block w-8 border-b-2 border-gray-400">
                            {letter}
                        </span>
                    ))}
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="font-medium">Questão:</p>
                    <p>{currentQuestion.question}</p>
                </div>

                {gameStatus === 'playing' ? (
                    <div className="flex gap-2">
                        <Input
                            value={guess}
                            onChange={(e) => setGuess(e.target.value)}
                            onKeyPress={handleKeyPress}
                            maxLength={1}
                            placeholder="Digite uma letra"
                            className="w-40"
                        />
                        <Button onClick={handleGuess}>Tentar</Button>
                    </div>
                ) : (
                    <Alert className={gameStatus === 'won' ? 'bg-green-50' : 'bg-red-50'}>
                        <AlertTitle>
                            {gameStatus === 'won' ? 'Parabéns!' : 'Game Over!'}
                        </AlertTitle>
                        <AlertDescription>
                            {gameStatus === 'won'
                                ? 'Você acertou a resposta!'
                                : `A resposta era: ${currentQuestion.answer}`}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="mt-4">
                    <p className="text-sm text-gray-600">
                        Letras tentadas: {guessedLetters.join(', ')}
                    </p>
                </div>

                {gameStatus !== 'playing' && (
                    <Button onClick={initializeGame} className="w-full">
                        Jogar Novamente
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

export default MathHangman;
