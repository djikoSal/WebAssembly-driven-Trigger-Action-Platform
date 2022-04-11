import os
import matplotlib.pyplot as plt

fileNames = [file for file in os.listdir(os.path.join(os.getcwd(), "test", "results")) if file[-4:] == '.txt']

"""
filterCodeIds = [result.split('-')[0] for result in results]
reqCounts = [result.split('-')[1] for result in results]
runtimes = [result.split('-')[2][:-4] for result in results]
"""

data = {}
for i in range(len(fileNames)):
    fileName = fileNames[i]
    filterCodeId = fileName.split('-')[0]
    reqCount = int(fileName.split('-')[1])
    runtime = fileName.split('-')[2][:-4]
    label = f"{filterCodeId}-{runtime}" # our label
    if label not in data:
        data[label] = {'reqCount': [], 'totalTime': []}
    f = open(os.path.join(os.getcwd(), "test", "results", fileName))
    for line in f.readlines():
        if line[:24] == 'filter code total time: ':
            totalTime = float(line[24:-1])
            data[label]['reqCount'].append(reqCount)
            data[label]['totalTime'].append(totalTime)
            f.close()
            break

print(data)
for label in data:
    zpd = zip(data[label]['reqCount'], data[label]['totalTime'])
    sortedZpd = sorted(zpd, key=lambda a: a[0])
    #print(sortedZpd)
    x = [pair[0] for pair in sortedZpd]
    y = [pair[1] for pair in sortedZpd]
    plt.plot(x, y,'-o', label=label)
plt.legend()
plt.ylabel("Time spent running filter code (ms)")
plt.xlabel("Number of requests")
plt.show()