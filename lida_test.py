from lida import Manager
lida = Manager()
summary = lida.summarize("src/constants/anual_aqi_data.json") 
print(summary)