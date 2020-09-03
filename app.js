window.addEventListener("DOMContentLoaded", () => {

	const btn = document.querySelector("button");
	const courseName = "PHP OPERATOR";
	let correctAns = 0;

	btn.addEventListener("click", sendData);

	async function sendData() {
		//get q body
		const qBodyRes = await fetch("./qBody.xml");
		const qBodyData = await qBodyRes.text();
		const qBodyDataProcess = qBodyData.split("newPart");
		qBodyDataProcess.shift();

		for (let i = 0; i < qBodyDataProcess.length; i++) {
			qBodyDataProcess[i] = qBodyDataProcess[i].replace(/\r\n/gm, "").trim();
		}

		//get q
		const qRes = await fetch("./q.xml");
		const qData = await qRes.text();
		const qDataProcess = qData.split("newQ");
		qDataProcess.shift();

		for (let i = 0; i < qDataProcess.length; i++) {
			qDataProcess[i] = qDataProcess[i].trim().replace(/\r\n/gm, "")
		}

		//get ans
		const ansRes = await fetch("./ans.xml");
		const ansData = await ansRes.text();
		const ansDataProcess = ansData.split("newAns");
		ansDataProcess.shift();

		for (let i = 0; i < ansDataProcess.length; i++) {
			ansDataProcess[i] = ansDataProcess[i].replace(/\r\n/gm, "").trim();
		}

		//get LS
		const userAns = [17, "*,/,+,-", "false", "false", 10, 99, "true", "no", "", 25];
		localStorage.setItem("userAns", JSON.stringify(userAns));
		const parseUserAns = JSON.parse(localStorage.getItem("userAns"));

		const jsonData = [
			[qBodyDataProcess, qDataProcess, ansDataProcess, parseUserAns, courseName]
		];

		for (let i = 0; i < jsonData[0][0].length; i++) {
			let okAns = jsonData[0][2][i];
			let userAns = jsonData[0][3][i];
			if (okAns == userAns) {
				correctAns++;
			}
		}

		//average/percentage of correct numbers
		let average = Math.round((correctAns / jsonData[0][0].length) * 100) + "%";

		let qBodyHtml = jsonData[0][0].map((item, index) => {
			return `
					<div class='wrapper' style='padding: 20px;'>

								<table border='0' cellpadding='0' cellspacing='0' width='100%'>
									<tr>
										<td align='center'
											style='color: #fff;font-size: 30px;display: inline-block;padding: 5px 10px;background-color: #0E6251;'>
											${index + 1}
											</td>
										<td width='30' align='center' height='30' colspan='1'></td>

										<td align='left'>
											<code style='font-size: 16px;'>
											${item}
										</code>
										</td>
									</tr>
								</table>

								<table border='0' cellpadding='0' cellspacing='0' width='100%'>
									<tr>
										<td width='600' align='center' height='30'></td>
									</tr>
								</table>

								<table border='0' cellpadding='0' cellspacing='0' width='100%'>
									<tr>
										<td align='left'>
											<span style='font-weight: bold; font-size: 20px;'>Question Was:</span>
											<span style='font-size: 18px;'>${jsonData[0][1][index]}</span>
										</td>
									</tr>
								</table>

								<table border='0' cellpadding='0' cellspacing='0' width='100%'>
									<tr>
										<td width='600' align='center' height='10'></td>
									</tr>
								</table>

								<table border='0' cellpadding='0' cellspacing='0' width='100%'>
									<tr>
										<td align='left'>
											<span style='font-weight: bold;font-size: 20px;'>Your Answer Was:</span>
											<span
											style = 'font-weight:bold ;font-size: 18px; ${(jsonData[0][2][index] != jsonData[0][3][index]) ? 'color: #FF0000 ' : 'color: #32CD32'}'>
											${jsonData[0][3][index]}
											</span>
										</td>
									</tr>
								</table>

								<table table border = '0'	cellpadding = '0'	cellspacing = '0'	width = '100%'
								style = '${(jsonData[0][2][index] != jsonData[0][3][index]) ? 'display:table' : 'display:none'}'>
									<tr>
										<td align='left'>
											<span style='font-weight: bold;font-size: 20px;'>Correct Answer Was:</span>
											<span style='font-size: 18px; color:#32CD32;font-weight:bold'>${(jsonData[0][2][index]!=jsonData[0][3][index])?jsonData[0][2][index]:""}</span>
										</td>
									</tr> 
								</table>

								<table border='0' cellpadding='0' cellspacing='0' width='100%'>
									<tr>
										<td width='600' align='center' height='10' style='border-bottom: 1px dotted #666;'></td>
									</tr>
								</table>
					</div>
			`;
		});

		let result = `
								<div class='result'>
								<table border='0' cellpadding='0' cellspacing='0' width='100%'>
									<tr>
										<td width='600' align='center'>
											<span style='font-weight: bold;font-size: 20px;'>Total Question Was:</span>
											<span style='font-weight: bold;font-size: 20px;'>
												${jsonData[0][0].length}
											</span>
										</td>
									</tr>
									<tr>
										<td width='600' align='center'>
											<span style='font-weight: bold;font-size: 20px;'>Total Correct Was:</span>
											<span style='font-weight: bold;font-size: 20px;'>
												${correctAns}
											</span>
										</td>
									</tr>
									<tr>
										<td width='600' align='center'>
											<span style='font-weight: bold;font-size: 20px;'>Total Average Is:</span>
											<span style='font-weight: bold;font-size: 20px;'>
												${average}
											</span>
										</td>
									</tr>
								</table>
							</div>
		`;

		let output = `
			<table bgcolor='#666666' width='100%' align='center' border='0' cellspacing='0' cellpadding='0'
		style='padding: 30px 0px;'>
		<tr>
			<td align='center'>
				<table bgcolor='#F6F6F6' align='center' border='0' cellpadding='0' cellspacing='0'>
					<tr>
						<td width='600' align='center' style='padding: 20px 10px;'>
							<table border='0' cellpadding='0' cellspacing='0' style='display: inline-block;'>
								<tr>
									<td width='600' align='center'
										style='font-size: 30px;font-style: italic;font-weight: bold;border-bottom: 2px solid #222;'>
										${jsonData[0][4]}
									</td>
								</tr>
								<tr>
									<td width='600' align='center' height='30' colspan='1'></td>
								</tr>
							</table>
							${qBodyHtml}

							${result}
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
		`;

		const show = document.querySelector(".show");
		show.innerHTML = output;

		const res = await fetch("./mail.php", {
			method: "post",
			body: output,
			headers: {
				"Content-Type": "application/text"
			}
		});
		const resData = await res.text();
		console.log(resData);
	}

});