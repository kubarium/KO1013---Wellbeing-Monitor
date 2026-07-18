<script setup lang="ts">
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import { computed, nextTick, ref } from "vue";

const wellbeing = ref({
  date: new Date(),
  gratitude: "",
  concerns: {
    "Is your environment clean?": false,
    "Is there music today?": false,
    "Any human connection so far?": false,
    "Have you consumed collagen?": false,
    "Are you moving enough?": false,
  },
  activities: {
    Collection: 0,
    Consumption: 0,
    Creation: 0,
    Community: 0,
    Contemplation: 0,
  },
  readiness_and_process: { sleep_quality: 0, procratination_source: "", deep_work: false },
  learning: "",
});

const hideInPrint = ref(false);
const legibleDate = computed(() => {
  const date = new Date(wellbeing.value.date);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
});

const print = async () => {
  hideInPrint.value = true;
  await nextTick();
  const pdf = new jsPDF("p", "in", "letter", true);
  html2canvas(document.querySelector("#wellbeing-monitor") as HTMLElement, {
    useCORS: true,
    allowTaint: false,
  }).then((canvas) => {
    pdf.addImage(canvas, "PNG", 0, 0, 8.5, 11);
    pdf.save(`Wellbeing Monitor - ${legibleDate.value}`);
    hideInPrint.value = false;
  });
};

const save = async () => {
  // 1. Serialize the object to a JSON string
  const data = JSON.stringify(wellbeing.value, null, 2);
  const blob = new Blob([data], { type: "application/json" });

  // 2. Prompt the user to select a save location and filename
  const fileHandle = await window.showSaveFilePicker({
    suggestedName: `Wellbeing Monitor - ${legibleDate.value}`,
    types: [
      {
        description: "JSON Files",
        accept: { "application/json": [".json"] },
      },
    ],
  });

  // 3. Write the Blob data to the selected file handle
  const writableStream = await fileHandle.createWritable();
  await writableStream.write(blob);
  await writableStream.close();
};

const load = async () => {
  const [fileHandle] = await window.showOpenFilePicker({
    types: [
      {
        description: "JSON Files",
        accept: { "application/json": [".json"] },
      },
    ],
  });

  const file = await fileHandle.getFile();
  const data = JSON.parse(await file.text());

  wellbeing.value = { ...wellbeing.value, ...data };
};
</script>

<template>
  <div
    id="wellbeing-monitor"
    class="flex flex-col gap-2 w-[8.5in] h-[11in] p-[.25in] overflow-clip"
  >
    <header class="flex py-2 items-center place-content-between gap-4 border-b border-zinc-300">
      <h1 class="text-2xl text-zinc-600 min-w-[62%]">Wellbeing Monitor</h1>
      <p v-if="hideInPrint">
        {{ legibleDate }}
      </p>
      <div v-else class="flex gap-2">
        <FloatLabel variant="on">
          <DatePicker
            inputId="over_label"
            v-model="wellbeing.date"
            showIcon
            iconDisplay="input"
            fluid
          />
          <label for="over_label">Date</label>
        </FloatLabel>
        <ButtonGroup>
          <Button id="print" @click="print" severity="info" icon="pi pi-print" size="small" />
          <Button id="save" @click="save" severity="info" icon="pi pi-download" size="small" />
          <Button id="load" @click="load" severity="info" icon="pi pi-cloud" size="small" />
        </ButtonGroup>
      </div>
    </header>
    <section>
      <h2 class="text-xl my-3 pb-1 border-b border-zinc-200">Starting</h2>
      <div class="flex gap-4">
        <IftaLabel class="grow">
          <Textarea
            id="gratitude"
            v-model="wellbeing.gratitude"
            rows="9"
            style="resize: none"
            fluid
          />
          <label for="gratitude">What can you be grateful for this morning?</label>
        </IftaLabel>
        <section class="">
          <h3 class="text-lg mb-2 pb-1 border-b border-slate-400">Tips for the day</h3>
          <div class="flex flex-col gap-1 grow">
            <p>✔ Focus on processes vs goals.</p>
            <p>✔ Enforce a distraction-free schedule.</p>
            <p>✔ Mind production over research.</p>
            <p>✔ Remember to reflect and rest.</p>
          </div>
        </section>
      </div>
    </section>
    <section>
      <h2 class="text-xl my-3 pb-1 border-b border-zinc-200">During the day</h2>
      <div class="flex justify-between gap-4">
        <section id="concerns">
          <h3 class="text-lg mb-2 pb-1 border-b border-slate-400">Concerns</h3>
          <div class="flex flex-col gap-1">
            <label
              class="flex items-center gap-2 h-7"
              v-for="(value, concern) in wellbeing.concerns"
              :key="concern"
            >
              <Checkbox
                v-model="wellbeing.concerns[concern]"
                :inputId="concern"
                binary
                class="my-1"
              />
              {{ concern }}
            </label>
          </div>
        </section>
        <section id="activities" class="flex flex-col grow">
          <h3 class="text-lg mb-2 pb-1 border-b border-slate-400">Activities</h3>
          <div class="flex flex-col gap-1">
            <p
              v-for="(rating, activity) in wellbeing.activities"
              :key="activity"
              class="flex items-center h-7"
            >
              {{ activity }} <Rating v-model="wellbeing.activities[activity]" class="ms-auto" />
            </p>
          </div>
        </section>
        <section id="distractions" class="flex flex-col w-[30%]">
          <h3 class="text-lg mb-2 pb-1 border-b border-slate-400">Readiness & Process</h3>
          <div class="flex flex-col grow gap-1">
            <p class="flex items-center h-7">
              Sleep quality
              <Rating v-model="wellbeing.readiness_and_process.sleep_quality" class="ms-auto" />
            </p>
            <label class="flex items-center gap-2 h-7">
              <Checkbox v-model="wellbeing.readiness_and_process.deep_work" binary />Adhered to deep
              work?
            </label>
            <IftaLabel class="flex grow">
              <Textarea
                id="distraction-source"
                v-model="wellbeing.readiness_and_process.procratination_source"
                style="resize: none"
                fluid
                class="h-full"
              />
              <label for="distraction-source">Procrastination source</label>
            </IftaLabel>
          </div>
        </section>
      </div>
    </section>
    <section>
      <h2 class="text-xl my-3 pb-1 border-b border-zinc-200">Finishing</h2>
      <div class="flex gap-4">
        <IftaLabel class="grow">
          <Textarea
            id="learning"
            v-model="wellbeing.learning"
            rows="9"
            style="resize: none"
            fluid
          />
          <label for="learning">What did you learn today?</label>
        </IftaLabel>
      </div>
    </section>
    <footer class="text-center p-2">Have a nice day!</footer>
  </div>
</template>

<style lang="css" scoped>
* {
  print-color-adjust: exact;
  image-rendering: optimizeQuality;
  shape-rendering: geometricPrecision;
}
</style>
