#400, 230
import random
import subprocess

desktop = random.randrange(3,400)
phone = random.randrange(3,230)
newData = "export const ANSWER = ['{0}','{1}']".format(desktop, phone)
with open('/Users/bendelany/workspace/circle/build/circuitgame.github.io/nums.js', "w") as myfile:
    myfile.write(newData)
    myfile.close()

print(subprocess.call("sudo cd /Users/bendelany/workspace/circle/build/circuitgame.github.io", shell=True))
print(subprocess.call("sudo git add *", shell=True))
print(subprocess.call("sudo git commit -m 'latest nums'", shell=True))
print(subprocess.call("sudo git push", shell=True))
