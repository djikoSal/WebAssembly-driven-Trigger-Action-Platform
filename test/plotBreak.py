# looks for result files in test/results/data, and creates broken plot called figure.pdf
from cProfile import run
import os
import matplotlib
import matplotlib.pyplot as plt
import numpy as np

font = {'family' : 'normal',
        #'weight' : 'bold',
        'size'   : 12}

matplotlib.rc('font', **font)

folderName = "data"
fileNames = [file for file in os.listdir(os.path.join(os.getcwd(), "test", "results",folderName)) if file[-4:] == '.txt']

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
    f = open(os.path.join(os.getcwd(), "test", "results", folderName, fileName))
    for line in f.readlines():
        if line[:24] == 'filter code total time: ':
            totalTime = float(line[24:-1])
            data[label][runtime]['reqCount'].append(reqCount)
            data[label][runtime]['totalTime'].append(totalTime)
            f.close()
            break


labels = data.keys()
x = np.arange(len(labels))  # the label locations
width = 0.13  # the width of the bars

fig, (ax, ax2) = plt.subplots(2, 1, sharex=True, figsize=(5,6), gridspec_kw={'height_ratios': [50, 150]})
ax.set_ylim(140, 600)  # outliers only
ax2.set_ylim(0, 50)  # most of the data
ax.spines['bottom'].set_visible(False)
ax2.spines['top'].set_visible(False)
#ax.xaxis.tick_top()
#ax.tick_params(labeltop=False)  # don't put tick labels at the top
#ax2.xaxis.tick_bottom()

rectsLst = []
runtimes = ['wasm', 'js-eval', 'js-vm', 'js-ivm', 'js-vm2', 'js-function']
print('looking for runtimes', runtimes)

runtime2totTime = {rt: [] for rt in runtimes}
for filterCodeId in data:
    for runtime in data[filterCodeId]:
        runtime2totTime[runtime].append(data[filterCodeId][runtime]['totalTime'][0])

x_offset = (-width * (len(runtimes) - 1) / 2)
for runtime in runtime2totTime:
    totTimes =  runtime2totTime[runtime]
    print(totTimes, runtime)
    roundedTimes = [round( x / 1000, 1) for x in totTimes]
    rect = ax.bar(x + x_offset, roundedTimes, width, label=runtime)
    ax.bar_label(rect, padding=5, fontsize=6, rotation=70)
    rect = ax2.bar(x + x_offset, roundedTimes, width, label=runtime)
    ax2.bar_label(rect, padding=5, fontsize=6, rotation=70)
    x_offset += width

# Add some text for labels, title and custom x-axis tick labels, etc.
fig.text(0, 0.55, 'Time spent running filter code (seconds)', va='center', rotation='vertical')
ax.set_title('Benchmark Test')
ax.tick_params(axis='x', bottom=False)
ax2.set_xticks(x, labels, fontsize=11, rotation = 12.5, ha = 'right')
ax.axes.yaxis.set_visible(False)
ax2.axes.yaxis.set_visible(False)
ax.legend(loc='upper center')
#ax.legend()

d = .015 
kwargs = dict(transform=ax.transAxes, color='k', clip_on=False)
ax.plot((-d, +d), (-d, +d), **kwargs)      
ax.plot((1 - d, 1 + d), (-d, +d), **kwargs)
kwargs.update(transform=ax2.transAxes)  
ax2.plot((-d, +d), (1 - d, 1 + d), **kwargs)  
ax2.plot((1 - d, 1 + d), (1 - d, 1 + d), **kwargs)


fig.tight_layout()
#plt.show()
plt.savefig('figure.pdf')