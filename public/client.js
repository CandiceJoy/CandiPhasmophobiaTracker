class Ghost
{
	#id;
	#element;
	#evidence;
	#possible;

	constructor(elementIn)
	{
		this.#id = elementIn.id;
		this.#element = elementIn;
		this.#possible = true;
		const temp = [];

		$(elementIn).children(".ghostEvidence").each(function()
		                                             {
			                                             const id = this.id;

			                                             if(id)
			                                             {
				                                             //const evidence = getEvidence(id);
				                                             temp.push(id);
			                                             }
		                                             });

		this.#evidence = temp;
	}

	update(include, exclude)
	{
		this.#possible = true;

		for(const i in exclude)
		{
			if(this.#evidence.includes(exclude[i]))
			{
				this.#possible = false;
				$(this.#element).children("#"+exclude[i]).addClass("impossible");
			}
		}

		for(const i in include)
		{
			if(!this.#evidence.includes(include[i]))
			{
				this.#possible = false;
			}
			else
			{
				$(this.#element).children("#"+include[i]).addClass("required");
			}
		}

		let maybe;

		for( const i in this.#evidence )
		{
			const evi = this.#evidence[i];

			if( !include.includes( evi ) && !exclude.includes( evi ))
			{
				$(this.#element).children("#"+evi).removeClass("impossible");
				$(this.#element).children("#"+evi).removeClass("required");

				if( !maybe )
				{
					maybe = evi;
				}
				else
				{
					maybe = "XXX";
				}
			}
		}

		if( maybe && maybe !== "XXX" && this.#possible )
		{
			$(this.#element).children("#"+maybe).addClass("maybe");
		}
		else
		{
			$(this.#element).children().removeClass("maybe");
		}

		if(this.#possible)
		{
			$(this.#element).addClass("highlight");
		}
		else
		{
			$(this.#element).removeClass("highlight");
		}
	}

	isPossible()
	{
		return this.#possible;
	}

	hasEvidence(evidence)
	{
		return this.#evidence.includes(evidence);
	}
}

function checkboxListener(event)
{
	const include = [];
	const exclude = [];

	$(".found").each(function()
	                 {
		                 if($(this).prop("checked"))
		                 {
			                 include.push(this.id);
		                 }

	                 });

	$(".excluded").each(function()
	                    {
		                    if($(this).prop("checked"))
		                    {
			                    exclude.push(this.id);
		                    }
	                    });

	for(const i in ghosts)
	{
		const ghost = ghosts[i];
		ghost.update(include, exclude);
	}

	updateEvidence();
}

function updateEvidence()
{
	$(".found").each(function()
	                 {
		                 //if theres no ghosts left that are isPossible with this evidence, disable, otherwise enable
		                 const id = this.id;
		                 let possible = false;
		                 let ghostNum = 0;
		                 let remainingGhosts = 0;
		                 const excludeChecked = $(".excluded#" + id).prop("checked");
		                 const foundChecked = $(".found#" + id).prop("checked");

		                 for(const i in ghosts)
		                 {
			                 const ghost = ghosts[i];

			                 if(ghost.isPossible())
			                 {
				                 remainingGhosts++;
			                 }

			                 if(ghost.hasEvidence(id))
			                 {
				                 if(ghost.isPossible())
				                 {
					                 possible = true;
					                 ghostNum++;
				                 }
			                 }
		                 }

		                 if(!excludeChecked)
		                 {
			                 $(this).prop("disabled", !possible);
			                 $(".excluded#" + id).prop("disabled", !possible);
		                 }

		                 if(!possible || excludeChecked)
		                 {
			                 $(this).parent().parent().find(".evidenceName").addClass("impossible");
		                 }
		                 else
		                 {
			                 $(this).parent().parent().find(".evidenceName").removeClass("impossible");
		                 }

		                 if(possible && foundChecked)
		                 {
			                 $(this).parent().parent().find(".evidenceName").addClass("required");
		                 }
		                 else
		                 {
			                 $(this).parent().parent().find(".evidenceName").removeClass("required");
		                 }

		                 if(possible && !excludeChecked && !foundChecked)
		                 {
			                 const prob = Math.round(ghostNum / remainingGhosts * 100);
			                 $(".prob#" + id).text(prob + "%");
		                 }
		                 else
		                 {
			                 $(".prob#" + id).text("");
		                 }
	                 });
}

function resetListener(event)
{
	$(".found,.excluded").prop("disabled", false);
	$(".found,.excluded").prop("checked", false);

	for(const i in ghosts)
	{
		const ghost = ghosts[i];
		ghost.update([], []);
	}

	updateEvidence();
}

const evidence = [];
const ghosts = [];
$("input.found,input.excluded").on("change", checkboxListener);
$(".reset").on("click", resetListener);
$(".ghost").each(function()
                 {
	                 ghosts.push(new Ghost(this));
                 });
resetListener(null);