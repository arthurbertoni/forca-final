import tkinter as tk
from tkinter import ttk, messagebox
import random

class MathHangman:
    def __init__(self, root):
        self.root = root
        self.root.title("Jogo da Forca - Teoria dos Conjuntos")
        self.root.geometry("800x600")
        
        # Dados do jogo
        self.conjuntos = {
            'A': ["Ana", "Bruno", "Carla", "Daniel"],
            'B': ["Bruno", "Eduarda", "Fabio", "Gabriela"],
            'C': ["Ana", "Gabriela", "Heitor", "Isabela"],
            'D': ["Carla", "Eduarda", "Isabela", "Joao"]
        }
        
        self.questions = [
            {
                "question": "Quem gosta de música clássica e jazz ao mesmo tempo (interseção de A e B)?",
                "answer": "Bruno"
            },
            {
                "question": "Quem gosta de música clássica ou jazz (união de A e B)?",
                "answer": "Ana"
            },
            {
                "question": "Quem gosta apenas de música clássica, mas não de jazz (diferença de A e B)?",
                "answer": "Daniel"
            },
            {
                "question": "Quem gosta de rock e não gosta de música eletrônica (diferença de C e D)?",
                "answer": "Heitor"
            },
            {
                "question": "Quem gosta de música eletrônica ou jazz, mas não de música clássica (união de B e D excluindo A)?",
                "answer": "Eduarda"
            }
        ]
        
        self.hangman_stages = [
            """
               --------
               |      |
               |      
               |    
               |      
               |     
               -
            """,
            """
               --------
               |      |
               |      O
               |    
               |      
               |     
               -
            """,
            """
               --------
               |      |
               |      O
               |      |
               |      |
               |     
               -
            """,
            """
               --------
               |      |
               |      O
               |     \\|
               |      |
               |     
               -
            """,
            """
               --------
               |      |
               |      O
               |     \\|/
               |      |
               |     
               -
            """,
            """
               --------
               |      |
               |      O
               |     \\|/
               |      |
               |     / 
               -
            """,
            """
               --------
               |      |
               |      O
               |     \\|/
               |      |
               |     / \\
               -
            """
        ]
        
        self.setup_ui()
        self.initialize_game()
        
    def setup_ui(self):
        # Frame principal
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Área dos conjuntos
        conjuntos_frame = ttk.LabelFrame(main_frame, text="Conjuntos", padding="5")
        conjuntos_frame.grid(row=0, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=5)
        
        conjuntos_text = f"""
        A = {self.conjuntos['A']} (Música Clássica)
        B = {self.conjuntos['B']} (Jazz)
        C = {self.conjuntos['C']} (Rock)
        D = {self.conjuntos['D']} (Eletrônica)
        """
        ttk.Label(conjuntos_frame, text=conjuntos_text, justify=tk.LEFT).grid(row=0, column=0)
        
        # Área do boneco da forca
        self.hangman_label = ttk.Label(main_frame, font=('Courier', 12), justify=tk.LEFT)
        self.hangman_label.grid(row=1, column=0, columnspan=2, pady=10)
        
        # Área da palavra
        self.word_var = tk.StringVar()
        ttk.Label(main_frame, textvariable=self.word_var, font=('Courier', 20)).grid(row=2, column=0, columnspan=2, pady=10)
        
        # Área da questão
        self.question_label = ttk.Label(main_frame, wraplength=600, justify=tk.LEFT)
        self.question_label.grid(row=3, column=0, columnspan=2, pady=10)
        
        # Área de entrada
        input_frame = ttk.Frame(main_frame)
        input_frame.grid(row=4, column=0, columnspan=2, pady=10)
        
        self.guess_var = tk.StringVar()
        self.guess_entry = ttk.Entry(input_frame, textvariable=self.guess_var, width=5)
        self.guess_entry.grid(row=0, column=0, padx=5)
        
        self.guess_button = ttk.Button(input_frame, text="Tentar", command=self.handle_guess)
        self.guess_button.grid(row=0, column=1, padx=5)
        
        # Área das letras tentadas
        self.guessed_letters_var = tk.StringVar()
        ttk.Label(main_frame, textvariable=self.guessed_letters_var).grid(row=5, column=0, columnspan=2, pady=5)
        
        # Botão de novo jogo
        self.new_game_button = ttk.Button(main_frame, text="Novo Jogo", command=self.initialize_game)
        self.new_game_button.grid(row=6, column=0, columnspan=2, pady=10)
        
        # Bind da tecla Enter
        self.guess_entry.bind('<Return>', lambda e: self.handle_guess())
        
    def initialize_game(self):
        self.current_question = random.choice(self.questions)
        self.word = ['_'] * len(self.current_question['answer'])
        self.guessed_letters = []
        self.incorrects = 0
        self.game_status = 'playing'
        
        self.update_display()
        self.guess_entry.config(state='normal')
        self.guess_button.config(state='normal')
        self.guess_entry.focus()
        
    def update_display(self):
        # Atualiza o boneco da forca
        self.hangman_label.config(text=self.hangman_stages[self.incorrects])
        
        # Atualiza a palavra
        self.word_var.set(' '.join(self.word))
        
        # Atualiza a questão
        self.question_label.config(text=self.current_question['question'])
        
        # Atualiza as letras tentadas
        self.guessed_letters_var.set(f"Letras tentadas: {', '.join(self.guessed_letters)}")
        
    def handle_guess(self):
        guess = self.guess_var.get().strip().upper()
        if not guess or guess in self.guessed_letters:
            return
        
        self.guessed_letters.append(guess)
        self.guess_var.set('')
        
        if guess in self.current_question['answer'].upper():
            for i, letter in enumerate(self.current_question['answer'].upper()):
                if letter == guess:
                    self.word[i] = self.current_question['answer'][i]
            
            if '_' not in self.word:
                self.game_status = 'won'
                messagebox.showinfo("Parabéns!", "Você acertou a resposta!")
                self.guess_entry.config(state='disabled')
                self.guess_button.config(state='disabled')
        else:
            self.incorrects += 1
            if self.incorrects >= 6:
                self.game_status = 'lost'
                messagebox.showinfo("Game Over!", f"A resposta era: {self.current_question['answer']}")
                self.guess_entry.config(state='disabled')
                self.guess_button.config(state='disabled')
        
        self.update_display()

if __name__ == '__main__':
    root = tk.Tk()
    game = MathHangman(root)
    root.mainloop()
