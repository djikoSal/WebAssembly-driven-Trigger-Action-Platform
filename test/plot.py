from cProfile import run
import os
import matplotlib.pyplot as plt
import numpy as np

fileNames = [file for file in os.listdir(os.path.join(os.getcwd(), "test", "results")) if file[-4:] == '.txt']

"""
filterCodeIds = [result.split('-')[0] for result in results]
reqCounts = [result.split('-')[1] for result in results]
runtimes = [result.split('-')[2][:-4] for result in results]
"""

data = {} # {filterCodeId: {runtime: {reqCount: [5000], totalTime: [1337]}}}
for i in range(len(fileNames)):
    fileName = fileNames[i]
    filterCodeId = ""
    for w in fileName.split('-'):
        if w.isnumeric():
            reqCount = int(w)
            break
        else:
            filterCodeId += w

    if not reqCount: Exception("Could not find request count from file: " + fileNames[i])
    runtime = ""
    tmp = fileName[:-4].split('-')
    tmp.reverse()
    for w in tmp:
        if w.isnumeric():
            break
        else:
            runtime = w + '-' + runtime if runtime is not "" else w
    label = f"{filterCodeId}" # our label
    if label not in data:
        data[label] = {}
    if runtime not in data[label]:
        data[label][runtime] = {'reqCount': [], 'totalTime': []}
    f = open(os.path.join(os.getcwd(), "test", "results", fileName))
    for line in f.readlines():
        if line[:24] == 'filter code total time: ':
            totalTime = float(line[24:-1])
            data[label][runtime]['reqCount'].append(reqCount)
            data[label][runtime]['totalTime'].append(totalTime)
            f.close()
            break


labels = data.keys()
x = np.arange(len(labels))  # the label locations
width = 0.1  # the width of the bars

fig, ax = plt.subplots()
rectsLst = []
runtimes = ['wasm', 'js-eval', 'js-vm', 'js-ivm', 'js-vm2', 'js-function']
print('looking for runtimes', runtimes)

runtime2totTime = {rt: [] for rt in runtimes}
for filterCodeId in data:
    for runtime in data[filterCodeId]:
        runtime2totTime[runtime].append(data[filterCodeId][runtime]['totalTime'][0])

x_offset = (- width * len(runtimes) / 2)
for runtime in runtime2totTime:
    totTimes =  runtime2totTime[runtime]
    print(totTimes, runtime)
    rectsLst.append(ax.bar(x + x_offset, totTimes, width, label=runtime))
    x_offset += width

# Add some text for labels, title and custom x-axis tick labels, etc.
ax.set_ylabel('Time spent running filter code (ms)')
ax.set_title('Filter code in different runtimes')
ax.set_xticks(x, labels)
ax.set_yticklabels([])
ax.legend()

[ax.bar_label(rect, padding=5) for rect in rectsLst]
fig.tight_layout()
plt.show()