#400, 230
import random
import subprocess
from git import Repo

desktop = random.randrange(8,400)
phone = random.randrange(8,230)
newData = "export const ANSWER = ['{0}','{1}']".format(desktop, phone)
with open('/Users/bendelany/workspace/circle/build/circuitgame.github.io/nums.js', "w") as myfile:
    myfile.write(newData)
    myfile.close()

full_local_path = "/Users/bendelany/workspace/circle/build/circuitgame.github.io"
username = "circuitgame"
password = "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"
remote = f"https://{username}:{password}@github.com/some-account/some-repo.git"

repo = Repo(full_local_path)
#print(repo.git.add('/Users/bendelany/workspace/circle/build/circuitgame.github.io/nums.js'))
repo.git.add(full_local_path)
print(repo.index.commit("Update nums"))
origin = repo.remote(name="origin")
print(origin.push())
